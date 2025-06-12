class ReportsController < ApplicationController
  def index
    @category_data = category_breakdown
    @daily_data = daily_breakdown
    @weekly_data = weekly_totals
    @top_categories = top_categories_data
  end

  private

  def category_breakdown
    # Calculate total minutes per category using Ruby calculations (database-agnostic)
    data = Current.user.categories.joins(:time_logs)
      .where.not(time_logs: { end_time: nil })
      .includes(:time_logs)
      .group_by(&:name)
    
    category_totals = data.map do |category_name, categories|
      total_minutes = categories.flat_map(&:time_logs)
        .select { |log| log.end_time.present? }
        .sum { |log| ((log.end_time - log.start_time) / 60).round }
      
      [category_name, total_minutes]
    end.to_h
    
    # Convert to hours and format for ApexCharts
    category_totals.map do |category, minutes|
      {
        name: category,
        hours: (minutes / 60.0).round(1),
        percentage: calculate_percentage(minutes, total_minutes)
      }
    end.select { |item| item[:hours] > 0 }
  end

  def daily_breakdown
    # Get time logs grouped by day with total hours
    base_date = 1.week.ago.beginning_of_week
    
    (0..6).map do |day_offset|
      date = base_date + day_offset.days
      day_logs = Current.user.time_logs.where(
        start_time: date.beginning_of_day..date.end_of_day
      )
      
      total_minutes = day_logs.sum do |log|
        next 0 unless log.end_time
        ((log.end_time - log.start_time) / 60).round
      end
      
      {
        day: date.strftime('%A'),
        date: date.strftime('%m/%d'),
        hours: (total_minutes / 60.0).round(1),
        entries: day_logs.count
      }
    end
  end

  def weekly_totals
    # Same as daily but formatted for column chart
    daily_breakdown.map do |day_data|
      {
        x: day_data[:day][0..2], # Mon, Tue, Wed, etc.
        y: day_data[:hours]
      }
    end
  end

  def top_categories_data
    # Top 5 categories by total time
    category_breakdown
      .sort_by { |cat| -cat[:hours] }
      .first(5)
      .map do |cat|
        {
          category: cat[:name],
          hours: cat[:hours],
          formatted: "#{cat[:hours]}h"
        }
      end
  end

  def total_minutes
    @total_minutes ||= Current.user.time_logs
      .where.not(end_time: nil)
      .sum { |log| ((log.end_time - log.start_time) / 60).round }
  end

  def calculate_percentage(minutes, total)
    return 0 if total == 0
    ((minutes / total) * 100).round(1)
  end

  # Helper method for chart colors
  def chart_colors
    [
      '#3B82F6', # Blue
      '#10B981', # Green  
      '#F59E0B', # Yellow
      '#EF4444', # Red
      '#8B5CF6', # Purple
      '#06B6D4', # Cyan
      '#F97316', # Orange
      '#84CC16', # Lime
      '#EC4899', # Pink
      '#6B7280'  # Gray
    ]
  end
  helper_method :chart_colors
end
