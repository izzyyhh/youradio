class CreateActiveUserlists < ActiveRecord::Migration[6.0]
  def change
    create_table :active_userlists do |t|
      t.references :server, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      
      t.timestamps
    end
  end
end
