# frozen_string_literal: true

class ReactionsController < ApplicationController
  def index
    render plain: 'OK'
  end

  def create
    reaction_type = params[:reaction][:reactionType]
    ActionCable.server.broadcast('reaction_channel_2', { reactionType: reaction_type })
  end
end
