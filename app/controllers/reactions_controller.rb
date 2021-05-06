# frozen_string_literal: true

class ReactionsController < ApplicationController
  def index
    render plain: 'OK'
  end

  def create
    reaction_type = params[:reaction][:reactionType]
    server_id = params[:reaction][:server_id]
    user_reacting = params[:reaction][:currentUser]
    ActionCable.server.broadcast("reaction_channel_#{server_id}",
                                 { reactionType: reaction_type, userReacting: user_reacting })
  end
end
