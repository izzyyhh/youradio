class AddStarttimeToTracks < ActiveRecord::Migration[6.0]
  def change
    add_column :tracks, :starttime, :datetime
  end
end
