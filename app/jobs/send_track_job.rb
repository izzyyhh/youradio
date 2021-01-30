class SendTrackJob < ApplicationJob
  queue_as :default

  def perform(playlist)
    ActionCable.server.broadcast "server_channel_#{playlist.server_id}", tracks: playlist.tracks, content_type: "tracks"
  end
end
