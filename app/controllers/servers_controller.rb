# frozen_string_literal: true

# a user can be part of a server. this controller manages the server
class ServersController < ApplicationController
  before_action :authenticate_user!, :set_server, only: %i[show edit update destroy]

  def index
    @servers = current_user.servers if user_signed_in?
  end

  def show
    @servers = if user_signed_in?
                 current_user.servers
               else
                 []
               end

    render 'index'
  end

  def new
    @server = Server.new
  end

  def create
    @server = current_user.servers.create(server_params)
    Playlist.create(server_id: @server.id)
    redirect_to @server
  end

  def update
    @server.update(server_params)
    redirect_to @server
  end

  private

  def set_server
    @server = Server.find(params[:id])
  end

  def server_params
    params.require(:server).permit(:name, :serverpic, :owner)
  end
end
