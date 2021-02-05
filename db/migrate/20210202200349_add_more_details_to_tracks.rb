# frozen_string_literal: true

class AddMoreDetailsToTracks < ActiveRecord::Migration[6.0]
  def change
    add_column :tracks, :description, :text
    add_column :tracks, :title, :string
    add_column :tracks, :thumbnail, :string
    add_column :tracks, :channeltitle, :string
  end
end
