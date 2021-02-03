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
    uri = params[:track][:uri]
    youtube_id = get_youtube_id(uri)
    url = "https://www.googleapis.com/youtube/v3/videos?id=#{youtube_id}&part=contentDetails&key=#{apiKey}"
    details_url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=#{youtube_id}&key=#{apiKey}"
    response = RestClient.get(url)

    p "------------------"
    p JSON.parse(response, object_class: OpenStruct)
    struct = JSON.parse(response, object_class: OpenStruct)
    details = JSON.parse(RestClient.get(details_url), object_class: OpenStruct)

    title = details.items[0].snippet.title
    description = details.items[0].snippet.description
    thumbnail = details.items[0].snippet.thumbnails.medium.url
    channeltitle = details.items[0].snippet.channelTitle
    #mehr details title, description, thumbnail,  channeltitle
    duration = struct.items[0].contentDetails.duration
    duration_in_s = convert_time(duration)

    server_id = params[:track][:server_id]
    @playlist = Server.find(server_id).playlist

    p "----------------------"
    if (@playlist.tracks.count == 0)
      @track = Server.find(server_id).playlist.tracks.create(uri: youtube_id, duration: duration_in_s,
        starttime: Time.now, title: title,
        channeltitle: channeltitle, description: description,
        thumbnail: thumbnail)
        
      p "das erste im empty"
    else 
      p time = @playlist.tracks.last.starttime + @playlist.tracks.last.duration.seconds
      p Time.now
      p (time - Time.now).seconds

      time = @playlist.tracks.last.starttime + @playlist.tracks.last.duration.seconds

      if !@playlist.tracks.first || (time - Time.now).seconds < 0
        @track = Server.find(server_id).playlist.tracks.create(uri: youtube_id, duration: duration_in_s,
          starttime: Time.now, title: title,
          channeltitle: channeltitle, description: description,
          thumbnail: thumbnail)

        p 'first trackkkkkkkkkkkk creating for the time'
      else
        p "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        last_track = @playlist.tracks.last
        old_starttime = last_track.starttime 
        old_duration = last_track.duration
        this_starttime= old_starttime + old_duration.seconds
        @track = Server.find(server_id).playlist.tracks.create(uri: youtube_id, duration: duration_in_s,
                                                        starttime: this_starttime, title: title,
                                                        channeltitle: channeltitle, description: description,
                                                        thumbnail: thumbnail)
        p 'first track existent'
      end

    end


    SendTrackJob.perform_later(@playlist)
  end

  private

  def tracks_params
    params.require(:track).permit(:uri)
  end

  def convert_time(dur)
    pattern = "PT"
    pattern += "%HH" if dur.include? "H"
    pattern += "%MM" if dur.include? "M"
    pattern += "%SS"
    DateTime.strptime(dur, pattern).seconds_since_midnight.to_i
  end
  
  def get_youtube_id(url)
    id = ''
    url = url.gsub(/(>|<)/i,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
    if url[2] != nil
      id = url[2].split(/[^0-9a-z_\-]/i)
      id = id[0];
    else
      id = url;
    end
    id
  end

end


