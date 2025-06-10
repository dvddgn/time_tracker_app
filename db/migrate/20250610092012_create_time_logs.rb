class CreateTimeLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :time_logs do |t|
      t.references :category, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.datetime :start_time
      t.datetime :end_time
      t.text :notes

      t.timestamps
    end
  end
end
