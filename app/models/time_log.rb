class TimeLog < ApplicationRecord
  belongs_to :category
  belongs_to :user

  validates :start_time, presence: true
  validates :category_id, presence: true
  validates :user_id, presence: true
  validates :notes, length: { maximum: 1000 }
  
  # Custom validation to ensure end_time is after start_time
  validate :end_time_after_start_time, if: :end_time?
  
  # Custom validation to ensure category belongs to the same user
  validate :category_belongs_to_user
  
  # Scopes for common queries
  scope :completed, -> { where.not(end_time: nil) }
  scope :ongoing, -> { where(end_time: nil) }
  scope :ordered_by_start_time, -> { order(start_time: :desc) }
  scope :for_today, -> { where(start_time: Date.current.beginning_of_day..Date.current.end_of_day) }
  scope :for_week, -> { where(start_time: Date.current.beginning_of_week..Date.current.end_of_week) }
  
  # Calculate duration in seconds
  def duration_in_seconds
    return 0 unless start_time && end_time
    (end_time - start_time).to_i
  end
  
  # Calculate duration in minutes
  def duration_in_minutes
    duration_in_seconds / 60.0
  end
  
  # Calculate duration in hours
  def duration_in_hours
    duration_in_minutes / 60.0
  end
  
  # Format duration as human readable string
  def duration_formatted
    return "In progress..." unless end_time
    
    total_minutes = duration_in_minutes.to_i
    hours = total_minutes / 60
    minutes = total_minutes % 60
    
    if hours > 0
      "#{hours}h #{minutes}m"
    else
      "#{minutes}m"
    end
  end
  
  # Check if time log is currently running
  def ongoing?
    start_time.present? && end_time.blank?
  end
  
  # Check if time log is completed
  def completed?
    start_time.present? && end_time.present?
  end
  
  private
  
  def end_time_after_start_time
    return unless start_time && end_time
    
    if end_time <= start_time
      errors.add(:end_time, "must be after start time")
    end
  end
  
  def category_belongs_to_user
    return unless category && user
    
    unless category.user_id == user_id
      errors.add(:category, "must belong to the same user")
    end
  end  
end
