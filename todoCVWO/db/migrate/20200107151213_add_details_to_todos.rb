class AddDetailsToTodos < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :details, :text
  end
end
