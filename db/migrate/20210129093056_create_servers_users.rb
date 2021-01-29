class CreateServersUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :servers_users do |t|
      t.references :user, null: false, foreign_key: true
      t.references :server, null: false, foreign_key: true

      t.timestamps
    end
  end
end
