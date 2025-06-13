class ReportsController < ApplicationController
  before_action :set_date_range
  before_action :set_time_logs

  def index
    @category_data = category_breakdown
    @daily_data = daily_breakdown
    @category_overview_data = category_overview_data
    @top_categories = top_categories_data
  end

  private

  # ==================================================================
  # SETUP METHODS
  # ==================================================================

  def set_date_range
    @start_date = parse_date_param(params[:start_date]) || Date.current.beginning_of_week
    @end_date = parse_date_param(params[:end_date]) || (Date.current.beginning_of_week + 4.days)
    
    # Ensure we don't exceed 30 days
    if (@end_date - @start_date).to_i > 30
      @start_date = @end_date - 30.days
    end
  end

  def set_time_logs
    @time_logs = Current.user.time_logs
      .completed
      .where(start_time: @start_date.beginning_of_day..@end_date.end_of_day)
  end

  # ==================================================================
  # CHART DATA METHODS
  # ==================================================================

  def category_breakdown
    # Use memoization to avoid recalculating
    @category_breakdown ||= build_category_breakdown
  end

  def daily_breakdown
    @daily_breakdown ||= build_daily_breakdown
  end

  def category_overview_data
    # Reuse category_breakdown to avoid duplicate queries
    category_breakdown.map do |cat_data|
      {
        x: truncate_category_name(cat_data[:name]),
        y: cat_data[:hours]
      }
    end
  end

  def top_categories_data
    @top_categories_data ||= build_top_categories
  end

  # ==================================================================
  # PRIVATE BUILDER METHODS
  # ==================================================================

  def build_category_breakdown
    # Single optimized query with SQL aggregation
    results = @time_logs
      .joins(:category)
      .group('categories.name')
      .select('categories.name, SUM(ROUND((julianday(end_time) - julianday(start_time)) * 24 * 60)) as total_minutes')
    
    total_minutes = results.sum(&:total_minutes)
    
    # Transform results into the format we need
    category_data = results.map do |result|
      {
        name: result.name,
        hours: calculate_hours(result.total_minutes),
        percentage: calculate_percentage(result.total_minutes, total_minutes),
        total_minutes: result.total_minutes
      }
    end
    
    # Filter out empty categories and sort by hours
    category_data
      .select { |item| item[:hours] > 0 }
      .sort_by { |cat| -cat[:hours] }
  end

  def build_daily_breakdown
    # Get aggregated data for each day
    results = @time_logs
      .group("DATE(start_time)")
      .select("DATE(start_time) as log_date, 
               SUM(ROUND((julianday(end_time) - julianday(start_time)) * 24 * 60)) as total_minutes,
               COUNT(*) as entry_count")
      .index_by(&:log_date)
    
    # Generate data for each day in the range (including days with no data)
    (@start_date..@end_date).map do |date|
      date_key = date.strftime('%Y-%m-%d')
      result = results[date_key]
      
      {
        day: date.strftime('%A'),
        date: date.strftime('%m/%d'),
        hours: result ? calculate_hours(result.total_minutes) : 0,
        entries: result ? result.entry_count : 0,
        timestamp: date.to_time.to_i
      }
    end
  end

  def build_top_categories
    # Get all-time top categories (not filtered by current date range)
    results = Current.user.time_logs
      .completed
      .joins(:category)
      .group('categories.name')
      .select('categories.name, SUM(ROUND((julianday(end_time) - julianday(start_time)) * 24 * 60)) as total_minutes')
      .order('total_minutes DESC')
      .limit(5)
    
    # Calculate total for percentage calculations
    total_minutes = Current.user.time_logs
      .completed
      .sum('ROUND((julianday(end_time) - julianday(start_time)) * 24 * 60)')
    
    # Transform results
    results.map do |result|
      hours = calculate_hours(result.total_minutes)
      {
        name: result.name,
        hours: hours,
        formatted: "#{hours}h",
        percentage: calculate_percentage(result.total_minutes, total_minutes)
      }
    end
  end

  # ==================================================================
  # UTILITY METHODS
  # ==================================================================

  def calculate_hours(minutes)
    (minutes / 60.0).round(1)
  end

  def calculate_percentage(minutes, total)
    return 0 if total == 0 || minutes == 0
    ((minutes.to_f / total) * 100).round(1)
  end

  def truncate_category_name(name, max_length = 12)
    name.length > max_length ? "#{name[0..max_length-1]}..." : name
  end

  def parse_date_param(date_string)
    return nil if date_string.blank?
    Date.parse(date_string)
  rescue ArgumentError
    nil
  end
end