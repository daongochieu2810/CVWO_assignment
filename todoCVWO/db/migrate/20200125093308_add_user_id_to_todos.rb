class AddUserIdToTodos < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :userID, :bigint
  end
end
