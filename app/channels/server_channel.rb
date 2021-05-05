# frozen_string_literal: true

# channel for websocket used for broadcasting in a server
class ServerChannel < ApplicationCable::Channel
  def subscribed
    stream_from "server_channel_#{params[:server_id]}"
    server_id = params[:server_id]
    user_id = current_user
    p "________________________________"
    p "subscribe"
    p server_id
    p user_id

    @currentServersUser = ServersUser.where(server_id: server_id).where(user_id: user_id)
    @currentServersUser.update(is_admin: true)
    p @currentServersUser
    SendUserJob.perform_later(server_id)
  end

  def unsubscribed
    server_id = params[:server_id]
    user_id = current_user
    p "________________________________"
    p "unsubscribe"
    p server_id
    p user_id

    @currentServersUser = ServersUser.where(server_id: server_id).where(user_id: user_id)
    @currentServersUser.update(is_admin: false)
    p @currentServersUser

    SendUserJob.perform_later(server_id)


  end
end
