class ReportsController < ApplicationController
  def index
    @category_data = category_breakdown
    @daily_data = daily_breakdown
    @weekly_data = weekly_totals
    @top_categories = top_categories_data
  end

  private

  def category_breakdown
    # Use same date range as daily breakdown
    start_date = parse_date_param(params[:start_date]) || Date.current.beginning_of_week
    end_date = parse_date_param(params[:end_date]) || (Date.current.beginning_of_week + 4.days)
    
    # Optimized single query with SQL aggregation
    results = Current.user.time_logs
      .completed
      .joins(:category)
      .where(start_time: start_date.beginning_of_day..end_date.end_of_day)
      .group('categories.name')
      .select('categories.name, SUM(ROUND((julianday(end_time) - julianday(start_time)) * 24 * 60)) as total_minutes')
    
    total_minutes = results.sum(&:total_minutes)
    
    results.map do |result|
      {
        name: result.name,
        hours: (result.total_minutes / 60.0).round(1),
        percentage: calculate_percentage(result.total_minutes, total_minutes),
        total_minutes: result.total_minutes
      }
    end.select { |item| item[:hours] > 0 }
     .sort_by { |cat| -cat[:hours] }
  end

  def daily_breakdown
    # Use date range from params or default to current week (Monday-Friday)
    start_date = parse_date_param(params[:start_date]) || Date.current.beginning_of_week
    end_date = parse_date_param(params[:end_date]) || (Date.current.beginning_of_week + 4.days)
    
    # Ensure we don't exceed a reasonable range
    date_range = (end_date - start_date).to_i
    if date_range > 30
      start_date = end_date - 30.days
    end
    
    results = Current.user.time_logs
      .completed
      .where(start_time: start_date.beginning_of_day..end_date.end_of_day)
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
        hours: result ? (result.total_minutes / 60.0).round(1) : 0,
        entries: result ? result.entry_count : 0,
        timestamp: date.to_time.to_i # For better sorting
      }
    end
  end

  def weekly_totals
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
    # Use already computed category data
    @category_data ||= category_breakdown
    @category_data
      .first(5)
      .map do |cat|
        {
          category: cat[:name],
          hours: cat[:hours],
          formatted: "#{cat[:hours]}h",
          percentage: cat[:percentage]
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
