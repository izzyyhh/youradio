# frozen_string_literal: true

class SendUserJob < ApplicationJob
  queue_as :default

  def perform(server_id)
    ActionCable.server.broadcast("reaction_channel_#{server_id}", { reactionType: 'active' })
  end
end
