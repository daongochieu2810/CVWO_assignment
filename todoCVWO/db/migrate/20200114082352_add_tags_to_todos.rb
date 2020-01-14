class AddTagsToTodos < ActiveRecord::Migration[6.0]
  def change
    add_column :todos, :tags, :string,array: true, default: []
  end
end
