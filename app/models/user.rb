class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :categories, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  validates :email_address, 
    presence: true, 
    uniqueness: true, 
    format: { with: URI::MailTo::EMAIL_REGEXP, message: "must be a valid email address" }
    
  validates :password, 
    length: { minimum: 8, message: "must be at least 8 characters long" },
    on: :create
    
  validates :password_confirmation, 
    presence: true, 
    on: :create
end
