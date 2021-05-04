# frozen_string_literal: true

class ReactionsChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "reaction_channel_#{params[:server_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
