# frozen_string_literal: true

class ChatmessagesController < ApplicationController
  def index; end

  def show; end

  def create
    @chatmessage = Chatmessage.create(chatmessages_params)

    SendMessageJob.perform_later(@chatmessage)
  end

  private

  def chatmessages_params
    params.require(:chatmessage).permit(:username, :content, :server_id)
  end
end
