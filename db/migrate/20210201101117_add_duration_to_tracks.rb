class AddDurationToTracks < ActiveRecord::Migration[6.0]
  def change
    add_column :tracks, :duration, :integer
  end
end
