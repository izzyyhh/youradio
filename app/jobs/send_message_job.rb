# frozen_string_literal: true

# a job which is used to broadcast the message (sent by a user) in the right server
class SendMessageJob < ApplicationJob
  queue_as :default

  def perform(message)
    # Do something later
    html = ApplicationController.render(
      partial: 'chatmessages/message',
      locals: { message: message }
    )

    ActionCable.server.broadcast "server_channel_#{message.server_id}", html: html
  end
end
