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
    # Get time logs grouped by category
    logs_by_category = @time_logs
      .joins(:category)
      .includes(:category)
      .group_by { |log| log.category.name }

    # Calculate total minutes for each category
    category_data = logs_by_category.map do |category_name, logs|
      total_minutes = logs.sum { |log| ((log.end_time - log.start_time) / 60).round }
      {
        name: category_name,
        hours: calculate_hours(total_minutes),
        percentage: calculate_percentage(total_minutes, total_minutes_for_all_categories),
        total_minutes: total_minutes
      }
    end

    # Filter out empty categories and sort by hours
    category_data
      .select { |item| item[:hours] > 0 }
      .sort_by { |cat| -cat[:hours] }
  end

  def build_daily_breakdown
    # Get time logs grouped by date
    results = @time_logs
      .group_by { |log| log.start_time.to_date }

    # Generate data for each day in the range (including days with no data)
    (@start_date..@end_date).map do |date|
      logs = results[date] || []
      total_minutes = logs.sum { |log| ((log.end_time - log.start_time) / 60).round }

      {
        day: date.strftime('%A'),
        date: date.strftime('%m/%d'),
        hours: calculate_hours(total_minutes),
        entries: logs.size,
        timestamp: date.to_time.to_i
      }
    end
  end

  def build_top_categories
    # Get all-time top categories (not filtered by current date range)
    logs_by_category = Current.user.time_logs
      .completed
      .joins(:category)
      .includes(:category)
      .group_by { |log| log.category.name }

    # Calculate total minutes for each category
    category_data = logs_by_category.map do |category_name, logs|
      total_minutes = logs.sum { |log| ((log.end_time - log.start_time) / 60).round }
      hours = calculate_hours(total_minutes)
      {
        name: category_name,
        hours: hours,
        formatted: "#{hours}h",
        percentage: calculate_percentage(total_minutes, total_minutes_for_all_time)
      }
    end

    # Sort by hours and take top 5
    category_data
      .sort_by { |cat| -cat[:hours] }
      .first(5)
  end

  # ==================================================================
  # UTILITY METHODS
  # ==================================================================

  def total_minutes_for_all_categories
    @total_minutes_for_all_categories ||= @time_logs.sum do |log|
      ((log.end_time - log.start_time) / 60).round
    end
  end

  def total_minutes_for_all_time
    @total_minutes_for_all_time ||= Current.user.time_logs.completed.sum do |log|
      ((log.end_time - log.start_time) / 60).round
    end
  end

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
