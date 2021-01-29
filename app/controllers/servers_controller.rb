class ServersController < ApplicationController
    before_action :authenticate_user!, :set_server, only: %i[ show edit update destroy ]

    def index
        @servers = Server.all
    end

    def show
        @servers = Server.all
        render 'index'
    end

    def new
        @server = Server.new
    end

    def create
        @server = Server.create(server_params)
        redirect_to @server
    end
end

private

def set_server
    @server = Server.find(params[:id])
end

def server_params
    params.require(:server).permit(:name)
end
