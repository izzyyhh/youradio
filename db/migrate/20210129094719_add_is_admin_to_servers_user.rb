class AddIsAdminToServersUser < ActiveRecord::Migration[6.0]
  def change
    add_column :servers_users, :is_admin, :boolean, :default => false
  end
end
