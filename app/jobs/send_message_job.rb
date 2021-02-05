# frozen_string_literal: true

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
