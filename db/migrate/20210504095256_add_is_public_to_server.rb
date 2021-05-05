class AddIsPublicToServer < ActiveRecord::Migration[6.0]
  def change
    add_column :servers, :is_public, :boolean, default: true
  end
end
