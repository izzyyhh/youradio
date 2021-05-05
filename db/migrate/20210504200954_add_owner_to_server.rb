class AddOwnerToServer < ActiveRecord::Migration[6.0]
  def change
    add_column :servers, :owner, :User
  end
end
