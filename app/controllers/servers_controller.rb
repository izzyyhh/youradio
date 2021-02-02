class ServersController < ApplicationController
    before_action :authenticate_user!, :set_server, only: %i[ show edit update destroy ]

    def index
        if user_signed_in?
            @servers = current_user.servers
        end
    end

    def show
        if user_signed_in?
            @servers = current_user.servers
        else
            @servers = []
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

    private

    def set_server
        @server = Server.find(params[:id])
    end

    def server_params
        params.require(:server).permit(:name, :serverpic)
    end
end


