class TracksController < ApplicationController
  def new
  end

  def index
  end

  def show
  end

  def create
    p "-----------------"
    #p params[:tracks][:uri]
    uri = params[:track][:uri]
    server_id = params[:track][:server_id]
    @track = Server.find(server_id).playlist.tracks.create(uri: uri)
    @playlist = Server.find(server_id).playlist 

    SendTrackJob.perform_later(@playlist)
  end

  private

  def tracks_params
    params.require(:track).permit(:uri)
  end
end