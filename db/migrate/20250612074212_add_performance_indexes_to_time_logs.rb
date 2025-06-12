class AddPerformanceIndexesToTimeLogs < ActiveRecord::Migration[8.0]
  def change
    # Add composite indexes for dashboard analytics performance
    add_index :time_logs, [:user_id, :start_time], 
              name: 'index_time_logs_on_user_id_and_start_time',
              comment: 'Optimize daily/weekly breakdown queries'
    
    add_index :time_logs, [:user_id, :end_time], 
              name: 'index_time_logs_on_user_id_and_end_time',
              comment: 'Optimize completed time logs queries'
    
    add_index :time_logs, [:user_id, :category_id, :start_time], 
              name: 'index_time_logs_on_user_category_start',
              comment: 'Optimize category breakdown queries'
    
    # Add index for completed time logs filtering
    add_index :time_logs, [:user_id, :end_time], 
              where: 'end_time IS NOT NULL',
              name: 'index_time_logs_on_user_completed',
              comment: 'Optimize queries for completed time logs only'
  end
end
