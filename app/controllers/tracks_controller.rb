class TracksController < ApplicationController
  def new
  end

  def index
  end

  def show
  end

  def create
    apiKey = ENV.fetch("API_KEY")
    #ENV['DATABASE_URL']
    p "-----------------"
    url = "https://www.googleapis.com/youtube/v3/videos?id=9bZkp7q19f0&part=contentDetails&key=" + apiKey
    response = RestClient.get(url)

    struct = JSON.parse(response, object_class: OpenStruct)
    duration = struct.items[0].contentDetails.duration
    duration_in_s = convert_time(duration)

    uri = params[:track][:uri]
    server_id = params[:track][:server_id]
    @playlist = Server.find(server_id).playlist

    p "----------------------"
    if (@playlist.tracks.count == 0)
      @track = Server.find(server_id).playlist.tracks.create(uri: uri, duration: duration_in_s, starttime:Time.now)
      p "das erste im empty"
    else 
      p time = @playlist.tracks.last.starttime + @playlist.tracks.last.duration.seconds
      p Time.now
      p (time - Time.now).seconds

      time = @playlist.tracks.last.starttime + @playlist.tracks.last.duration.seconds

      if !@playlist.tracks.first || (time - Time.now).seconds < 0
        @track = Server.find(server_id).playlist.tracks.create(uri: uri, duration: duration_in_s, starttime:Time.now)
        p 'first trackkkkkkkkkkkk creating for the time'
      else
        last_track = @playlist.tracks.last
        old_starttime = last_track.starttime 
        old_duration = last_track.duration
        this_starttime=old_starttime + duration_in_s.seconds
        @track = Server.find(server_id).playlist.tracks.create(uri: uri, duration: duration_in_s, starttime: this_starttime)
        p 'first track existent'
      end

    end


    SendTrackJob.perform_later(@playlist)
  end

  private

  def tracks_params
    params.require(:track).permit(:uri)
  end
end



def convert_time(dur)
  pattern = "PT"
  pattern += "%HH" if dur.include? "H"
  pattern += "%MM" if dur.include? "M"
  pattern += "%SS"
  DateTime.strptime(dur, pattern).seconds_since_midnight.to_i
end