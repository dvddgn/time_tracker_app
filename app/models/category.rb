class Category < ApplicationRecord
  belongs_to :user
  has_many :time_logs, dependent: :destroy

  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :description, length: { maximum: 500 }
  
  scope :ordered_by_name, -> { order(:name) }
end
