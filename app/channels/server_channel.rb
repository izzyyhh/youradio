# frozen_string_literal: true

# channel for websocket used for broadcasting in a server
class ServerChannel < ApplicationCable::Channel
  def subscribed
    stream_from "server_channel_#{params[:server_id]}"
    server_id = params[:server_id]
    user_id = current_user.id
    p '________________________________'
    p 'subscribe'
    p server_id
    p user_id

    if ActiveUserlist.where(server_id: server_id, user_id: user_id).empty?
      ActiveUserlist.create(server_id: server_id, user_id: user_id, is_active: true)
    else
      ActiveUserlist.where(server_id: server_id, user_id: user_id).first.update(is_active: true)
    end

    SendUserJob.perform_later(server_id)
  end

  def unsubscribed
    server_id = params[:server_id]
    user_id = current_user
    p '________________________________'
    p 'unsubscribe'
    p server_id
    p user_id

    if ActiveUserlist.where(server_id: server_id, user_id: user_id).empty?
      ActiveUserlist.create(server_id: server_id, user_id: user_id, is_active: false)
    else
      ActiveUserlist.where(server_id: server_id, user_id: user_id).first.update(is_active: false)
    end

    SendUserJob.perform_later(server_id)
  end
end
