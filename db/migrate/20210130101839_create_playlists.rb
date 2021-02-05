# frozen_string_literal: true

class CreatePlaylists < ActiveRecord::Migration[6.0]
  def change
    create_table :playlists do |t|
      t.references :server, null: false, foreign_key: true

      t.timestamps
    end
  end
end
