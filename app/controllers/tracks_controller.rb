# frozen_string_literal: true

# the controller for loading data from the youtubeapi foreach track and save params into playlist
class TracksController < ApplicationController
  def new; end

  def index; end

  def show; end

  def create
    uri = params[:track][:uri]
    youtube_id = get_youtube_id(uri)

    if validate_uri(uri)
      struct = fetch_youtube_struct(youtube_id)
      details = fetch_youtube_details(youtube_id)

      add_to_playlist_with_calculated_time(struct, details, youtube_id)

    else
      p 'Url ist empty oder nil-> so geht das nicht'

    end
  end

  private

  def create_track_by_details(server_id, video_details, youtube_id, starttime = Time.now)
    Server.find(server_id).playlist.tracks.create(
      uri: youtube_id, duration: video_details.duration_in_s,
      starttime: starttime, title: video_details.title,
      channeltitle: video_details.channeltitle,
      description: video_details.description,
      thumbnail: video_details.thumbnail
    )
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def add_to_playlist_with_calculated_time(struct, details, youtube_id)
    # get video details from api
    video_details = VideoDetails.new(struct, details)
    server_id = params[:track][:server_id]
    @playlist = Server.find(server_id).playlist

    # time calculation
    # if playlist empty
    if @playlist.tracks.count.zero?
      @track = create_track_by_details(server_id, video_details, youtube_id)
    # das erste im empty

    # if playlist has entries
    else
      time = @playlist.tracks.last.starttime + @playlist.tracks.last.duration.seconds

      # if playlist has already stopped but has entries which already have been played
      if !@playlist.tracks.first || (time - Time.now).seconds.negative?
        @track = create_track_by_details(server_id, video_details, youtube_id)

      # if playlist has songs and play a song
      else
        this_starttime = calculate_starttime(@playlist)
        @track = create_track_by_details(server_id, video_details, youtube_id, this_starttime)
        # first track existent
      end
    end

    SendTrackJob.perform_later(@playlist)
  rescue StandardError => e
    logger.error e.message
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def calculate_starttime(_playlist)
    last_track = @playlist.tracks.last
    old_starttime = last_track.starttime
    old_duration = last_track.duration

    old_starttime + old_duration.seconds
  end

  def fetch_youtube_struct(youtube_id)
    api_key = ENV.fetch('API_KEY')

    url = "https://www.googleapis.com/youtube/v3/videos?id=#{youtube_id}&part=contentDetails&key=#{api_key}"
    JSON.parse(RestClient.get(url), object_class: OpenStruct)
  end

  def fetch_youtube_details(youtube_id)
    api_key = ENV.fetch('API_KEY')

    details_url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=#{youtube_id}&key=#{api_key}"
    JSON.parse(RestClient.get(details_url), object_class: OpenStruct)
  end

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

# video details class
class VideoDetails
  attr_reader :title, :description, :thumbnail, :channeltitle, :duration_in_s

  # rubocop:disable Metrics/AbcSize
  def initialize(struct, details)
    @title = details.items[0].snippet.title
    @description = details.items[0].snippet.description
    @thumbnail = details.items[0].snippet.thumbnails.medium.url
    @channeltitle = details.items[0].snippet.channelTitle
    # mehr details title, description, thumbnail,  channeltitle
    @duration_in_s = convert_time(struct.items[0].contentDetails.duration)
  end
  # rubocop:enable Metrics/AbcSize

  def convert_time(dur)
    pattern = 'PT'
    pattern += '%HH' if dur.include? 'H'
    pattern += '%MM' if dur.include? 'M'
    pattern += '%SS'
    DateTime.strptime(dur, pattern).seconds_since_midnight.to_i
  end
end
