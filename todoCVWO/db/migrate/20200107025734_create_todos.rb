class CreateTodos < ActiveRecord::Migration[6.0]
  def change
    create_table :todos do |t|
      t.string :title, null: false
      t.integer :urgency_point
      t.string :deadline
      t.string :time_left
      t.boolean :done

      t.timestamps
    end
  end
end
