# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Clear existing data in development
if Rails.env.development?
  puts "Clearing existing data..."
  TimeLog.destroy_all
  Category.destroy_all
  User.destroy_all
end

# Create a sample user for our time tracking data
puts "Creating sample user..."
user = User.create!(
  email_address: "demo@timetracker.com",
  password: "password123",
  password_confirmation: "password123"
)

puts "✅ Created user: #{user.email_address}"

# Create realistic work categories
puts "\nCreating work categories..."
categories_data = [
  {
    name: "Software Development",
    description: "Coding, programming, building features and applications"
  },
  {
    name: "Client Meetings", 
    description: "Video calls, phone meetings, and client communication"
  },
  {
    name: "Code Review",
    description: "Reviewing pull requests, code quality checks, and team collaboration"
  },
  {
    name: "Documentation",
    description: "Writing docs, API documentation, and technical specifications"
  },
  {
    name: "UI/UX Design",
    description: "User interface design, wireframing, and user experience planning"
  },
  {
    name: "Project Planning",
    description: "Sprint planning, project scoping, and task estimation"
  },
  {
    name: "Email & Admin",
    description: "Administrative tasks, email correspondence, and general office work"
  },
  {
    name: "Learning & Training",
    description: "Skill development, tutorials, courses, and professional growth"
  },
  {
    name: "Bug Fixes",
    description: "Debugging, fixing issues, and resolving technical problems"
  },
  {
    name: "Testing",
    description: "Writing tests, QA testing, and ensuring code quality"
  }
]

categories = []
categories_data.each do |category_data|
  category = user.categories.create!(category_data)
  categories << category
  puts "  📁 Created category: #{category.name}"
end

puts "✅ Created #{categories.length} categories"

# Generate a week of realistic time tracking data
puts "\nGenerating week of time tracking data..."

# Define the work week (Monday to Friday)
base_date = 1.week.ago.beginning_of_week # Start from last Monday
work_days = (0..4).map { |i| base_date + i.days }

# Time tracking patterns for each day
daily_patterns = {
  0 => [ # Monday - Fresh start, longer development blocks
    { category: "Email & Admin", start_hour: 9, duration: 30, notes: "Morning email review and planning" },
    { category: "Project Planning", start_hour: 9.5, duration: 60, notes: "Sprint planning for upcoming features" },
    { category: "Software Development", start_hour: 10.5, duration: 180, notes: "Implementing user authentication system" },
    { category: "Client Meetings", start_hour: 14, duration: 45, notes: "Weekly client check-in and requirements review" },
    { category: "Documentation", start_hour: 15, duration: 90, notes: "Writing API documentation for new endpoints" },
    { category: "Code Review", start_hour: 16.5, duration: 60, notes: "Reviewing team pull requests and providing feedback" }
  ],
  1 => [ # Tuesday - Mix of meetings and coding
    { category: "Software Development", start_hour: 9, duration: 120, notes: "Building responsive navigation component" },
    { category: "Client Meetings", start_hour: 11, duration: 60, notes: "Project status meeting with stakeholders" },
    { category: "UI/UX Design", start_hour: 12, duration: 90, notes: "Designing user dashboard mockups" },
    { category: "Bug Fixes", start_hour: 14, duration: 75, notes: "Fixing pagination issues in data tables" },
    { category: "Testing", start_hour: 15.5, duration: 60, notes: "Writing unit tests for authentication" },
    { category: "Learning & Training", start_hour: 16.5, duration: 45, notes: "Ruby on Rails security best practices tutorial" }
  ],
  2 => [ # Wednesday - Deep work day with focus blocks
    { category: "Software Development", start_hour: 8.5, duration: 240, notes: "Deep focus: implementing time log CRUD operations" },
    { category: "Email & Admin", start_hour: 12.5, duration: 20, notes: "Quick email check and responses" },
    { category: "Software Development", start_hour: 13, duration: 150, notes: "Adding search and sort functionality to tables" },
    { category: "Documentation", start_hour: 15.5, duration: 60, notes: "Updating README and setup instructions" },
    { category: "Code Review", start_hour: 16.5, duration: 45, notes: "Final review of authentication implementation" }
  ],
  3 => [ # Thursday - Collaborative work, reviews, meetings
    { category: "Project Planning", start_hour: 9, duration: 45, notes: "Daily standup and task prioritization" },
    { category: "Software Development", start_hour: 9.75, duration: 105, notes: "Implementing category management features" },
    { category: "Client Meetings", start_hour: 11.5, duration: 90, notes: "Feature demo and feedback session" },
    { category: "Bug Fixes", start_hour: 13, duration: 45, notes: "Resolving mobile responsive issues" },
    { category: "Testing", start_hour: 14, duration: 90, notes: "Integration testing for time tracking features" },
    { category: "UI/UX Design", start_hour: 15.5, duration: 75, notes: "Refining table layouts and user experience" },
    { category: "Email & Admin", start_hour: 16.75, duration: 30, notes: "End of day administrative tasks" }
  ],
  4 => [ # Friday - Wrap-up tasks, documentation, planning
    { category: "Software Development", start_hour: 9, duration: 90, notes: "Adding data visualization components" },
    { category: "Documentation", start_hour: 10.5, duration: 60, notes: "Creating user guide and feature documentation" },
    { category: "Client Meetings", start_hour: 11.5, duration: 30, notes: "Quick client update call" },
    { category: "Testing", start_hour: 12, duration: 75, notes: "End-to-end testing of complete workflow" },
    { category: "Code Review", start_hour: 13.5, duration: 60, notes: "Week's final code reviews and approvals" },
    { category: "Project Planning", start_hour: 14.5, duration: 45, notes: "Next week planning and task preparation" },
    { category: "Learning & Training", start_hour: 15.25, duration: 90, notes: "Exploring new Rails features and best practices" }
  ]
}

total_logs_created = 0

work_days.each_with_index do |date, day_index|
  day_name = date.strftime('%A')
  puts "\n  📅 Creating time logs for #{day_name} (#{date.strftime('%B %d, %Y')})"
  
  daily_patterns[day_index].each do |pattern|
    category = categories.find { |c| c.name == pattern[:category] }
    
    # Calculate start and end times
    start_time = date.beginning_of_day + pattern[:start_hour].hours
    end_time = start_time + pattern[:duration].minutes
    
    # Occasionally create ongoing time logs (no end time)
    end_time = nil if pattern[:duration] > 120 && rand < 0.1
    
    time_log = user.time_logs.create!(
      category: category,
      start_time: start_time,
      end_time: end_time,
      notes: pattern[:notes]
    )
    
    duration_text = end_time ? time_log.duration_formatted : "In progress"
    puts "    ⏰ #{pattern[:category]}: #{start_time.strftime('%I:%M %p')} (#{duration_text})"
    total_logs_created += 1
  end
end

puts "\n✅ Created #{total_logs_created} time log entries"

# Display summary statistics
puts "\n" + "="*50
puts "📊 SEEDING COMPLETE - SUMMARY STATISTICS"
puts "="*50

puts "\n👤 USER DATA:"
puts "  Email: #{user.email_address}"
puts "  Password: password123"

puts "\n📁 CATEGORIES CREATED:"
categories.each do |category|
  time_log_count = category.time_logs.count
  total_duration = category.time_logs.sum { |tl| tl.duration_in_minutes || 0 }
  puts "  #{category.name}: #{time_log_count} entries (#{total_duration} minutes)"
end

puts "\n⏰ TIME TRACKING SUMMARY:"
total_entries = user.time_logs.count
completed_entries = user.time_logs.where.not(end_time: nil).count
ongoing_entries = user.time_logs.where(end_time: nil).count
total_minutes = user.time_logs.sum { |tl| tl.duration_in_minutes || 0 }
total_hours = (total_minutes / 60.0).round(1)

puts "  Total time log entries: #{total_entries}"
puts "  Completed entries: #{completed_entries}"
puts "  Ongoing entries: #{ongoing_entries}"
puts "  Total time tracked: #{total_hours} hours (#{total_minutes} minutes)"

# Daily breakdown
puts "\n📅 DAILY BREAKDOWN:"
work_days.each do |date|
  day_entries = user.time_logs.where(start_time: date.beginning_of_day..date.end_of_day)
  day_minutes = day_entries.sum { |tl| tl.duration_in_minutes || 0 }
  day_hours = (day_minutes / 60.0).round(1)
  puts "  #{date.strftime('%A, %B %d')}: #{day_entries.count} entries (#{day_hours} hours)"
end

puts "\n🎯 READY FOR TESTING:"
puts "  ✅ Data tables have sufficient entries for pagination testing"
puts "  ✅ Search functionality can be tested across varied content"
puts "  ✅ Sorting can be tested with diverse data types"
puts "  ✅ Dashboard charts will have rich, varied data"
puts "  ✅ Week-long data perfect for time-based visualizations"

puts "\n🚀 NEXT STEPS:"
puts "  1. Visit /time_logs to see enhanced data tables in action"
puts "  2. Test search, sort, and pagination with realistic data"
puts "  3. Try different page sizes and navigation"
puts "  4. Ready for dashboard charts implementation!"

puts "\n" + "="*50