class AddIsActiveToActiveUserlist < ActiveRecord::Migration[6.0]
  def change
    add_column :active_userlists, :is_active, :boolean
  end
end
