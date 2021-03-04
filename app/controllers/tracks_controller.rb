# frozen_string_literal: true

# the controller for loading data from the youtubeapi foreach track and save params into playlist
class TracksController < ApplicationController
  def new; end

  def index; end

  def show; end

  def create
    apiKey = ENV.fetch('API_KEY')
    # ENV['DATABASE_URL']
    uri = params[:track][:uri]
    uri_useable = validate_uri(uri)
    server_id = params[:track][:server_id]

    if uri_useable

      youtube_id = get_youtube_id(uri)
      url = "https://www.googleapis.com/youtube/v3/videos?id=#{youtube_id}&part=contentDetails&key=#{apiKey}"
      details_url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=#{youtube_id}&key=#{apiKey}"
      response = RestClient.get(url)
      struct = JSON.parse(response, object_class: OpenStruct)
      details = JSON.parse(RestClient.get(details_url), object_class: OpenStruct)

      # try catch block

      begin
        # get video details from api
        title = details.items[0].snippet.title
        description = details.items[0].snippet.description
        thumbnail = details.items[0].snippet.thumbnails.medium.url
        channeltitle = details.items[0].snippet.channelTitle
        # mehr details title, description, thumbnail,  channeltitle
        duration = struct.items[0].contentDetails.duration
        duration_in_s = convert_time(duration)

        server_id = params[:track][:server_id]
        @playlist = Server.find(server_id).playlist

        # time calculation

        # if playlist empty
        if @playlist.tracks.count.zero?
          @track = Server.find(server_id).playlist.tracks.create(uri: youtube_id, duration: duration_in_s,
                                                                 starttime: Time.now, title: title,
                                                                 channeltitle: channeltitle, description: description,
                                                                 thumbnail: thumbnail)
          p 'das erste im empty'

        # if playlist has entries
        else
          p time = @playlist.tracks.last.starttime + @playlist.tracks.last.duration.seconds
          p Time.now
          p (time - Time.now).seconds
          time = @playlist.tracks.last.starttime + @playlist.tracks.last.duration.seconds

          # if playlist has already stopped but has entries which already have been played
          if !@playlist.tracks.first || (time - Time.now).seconds.negative?
            @track = Server.find(server_id).playlist.tracks.create(uri: youtube_id, duration: duration_in_s,
                                                                   starttime: Time.now, title: title,
                                                                   channeltitle: channeltitle, description: description,
                                                                   thumbnail: thumbnail)

          # if playlist has songs and play a song
          else

            last_track = @playlist.tracks.last
            old_starttime = last_track.starttime
            old_duration = last_track.duration
            this_starttime = old_starttime + old_duration.seconds
            @track = Server.find(server_id).playlist.tracks.create(uri: youtube_id, duration: duration_in_s,
                                                                   starttime: this_starttime, title: title,
                                                                   channeltitle: channeltitle, description: description,
                                                                   thumbnail: thumbnail)
            p 'first track existent'
          end

        end
        SendTrackJob.perform_later(@playlist)
      rescue StandardError
        p 'Die eigegebene Url liefert keine Daten'
      end
    else
      p 'Url ist empty oder nil-> so geht das nicht'

    end
  end

  private

  def validate_uri(uri)
    # check if input is empty
    if (uri != '') && !uri.nil?
      id = get_youtube_id(uri)

      # check if youtube id is empty
      if (id != '') && !id.nil?
        true
      else
        false
      end
    else
      false
    end
  end

  def tracks_params
    params.require(:track).permit(:uri)
  end

  def convert_time(dur)
    pattern = 'PT'
    pattern += '%HH' if dur.include? 'H'
    pattern += '%MM' if dur.include? 'M'
    pattern += '%SS'
    DateTime.strptime(dur, pattern).seconds_since_midnight.to_i
  end

  def get_youtube_id(url)
    id = ''
    url = url.gsub(/(>|<)/i, '').split(%r{(vi/|v=|/v/|youtu\.be/|/embed/)})
    if url[2].nil?
      id = url
    else
      id = url[2].split(/[^0-9a-z_\-]/i)
      id = id[0]
    end
    id
  end
end
