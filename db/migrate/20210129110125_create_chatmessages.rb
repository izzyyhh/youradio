class CreateChatmessages < ActiveRecord::Migration[6.0]
  def change
    create_table :chatmessages do |t|
      t.string :username
      t.text :content
      t.references :server, null: false, foreign_key: true

      t.timestamps
    end
  end
end
