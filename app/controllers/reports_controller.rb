class ReportsController < ApplicationController
  def index
    @category_data = category_breakdown
    @daily_data = daily_breakdown
    @category_overview_data = category_overview_data
    @top_categories = top_categories_data
  end

  private

  def date_range
    start_date = parse_date_param(params[:start_date]) || Date.current.beginning_of_week
    end_date = parse_date_param(params[:end_date]) || (Date.current.beginning_of_week + 4.days)
    
    # Ensure we don't exceed a reasonable range
    date_range = (end_date - start_date).to_i
    if date_range > 30
      start_date = end_date - 30.days
    end

    [start_date, end_date]
  end

  def time_logs_in_range
    start_date, end_date = date_range
    Current.user.time_logs
      .completed
      .where(start_time: start_date.beginning_of_day..end_date.end_of_day)
  end

  def calculate_hours(minutes)
    (minutes / 60.0).round(1)
  end

  def category_breakdown
    start_date, end_date = date_range
    
    # Optimized single query with SQL aggregation
    results = time_logs_in_range
      .joins(:category)
      .group('categories.name')
      .select('categories.name, SUM(ROUND((julianday(end_time) - julianday(start_time)) * 24 * 60)) as total_minutes')
    
    total_minutes = results.sum(&:total_minutes)
    
    results.map do |result|
      {
        name: result.name,
        hours: calculate_hours(result.total_minutes),
        percentage: calculate_percentage(result.total_minutes, total_minutes),
        total_minutes: result.total_minutes
      }
    end.select { |item| item[:hours] > 0 }
     .sort_by { |cat| -cat[:hours] }
  end

  def daily_breakdown
    start_date, end_date = date_range
    
    results = time_logs_in_range
      .group("DATE(start_time)")
      .select("DATE(start_time) as log_date, 
               SUM(ROUND((julianday(end_time) - julianday(start_time)) * 24 * 60)) as total_minutes,
               COUNT(*) as entry_count")
      .index_by(&:log_date)
    
    # Generate data for each day in the range
    (start_date..end_date).map do |date|
      date_key = date.strftime('%Y-%m-%d')
      result = results[date_key]
      
      {
        day: date.strftime('%A'),
        date: date.strftime('%m/%d'),
        hours: result ? calculate_hours(result.total_minutes) : 0,
        entries: result ? result.entry_count : 0,
        timestamp: date.to_time.to_i # For better sorting
      }
    end
  end

  def category_overview_data
    # Use category data for column chart
    @category_data ||= category_breakdown
    @category_data.map do |cat_data|
      {
        x: cat_data[:name].length > 12 ? cat_data[:name][0..11] + '...' : cat_data[:name], # Truncate long names
        y: cat_data[:hours]
      }
    end
  end

  def top_categories_data
    # Get all-time top categories (not filtered by date range)
    results = Current.user.time_logs
      .completed
      .joins(:category)
      .group('categories.name')
      .select('categories.name, SUM(ROUND((julianday(end_time) - julianday(start_time)) * 24 * 60)) as total_minutes')
      .order('total_minutes DESC')
      .limit(5)
    
    total_minutes = Current.user.time_logs.completed.sum('ROUND((julianday(end_time) - julianday(start_time)) * 24 * 60)')
    
    results.map do |result|
      {
        name: result.name,
        hours: calculate_hours(result.total_minutes),
        formatted: "#{calculate_hours(result.total_minutes)}h",
        percentage: calculate_percentage(result.total_minutes, total_minutes)
      }
    end
  end

  def calculate_percentage(minutes, total)
    return 0 if total == 0 || minutes == 0
    ((minutes.to_f / total) * 100).round(1)
  end

  def parse_date_param(date_string)
    return nil if date_string.blank?
    Date.parse(date_string)
  rescue ArgumentError
    nil
  end
end
