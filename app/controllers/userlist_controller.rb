# frozen_string_literal: true

class UserlistController < ApplicationController
  def index
    userlist = []

    active_users = ActiveUserlist.where(server_id: params[:server_id]).where(is_active: true)
    active_users.each do |u|
      single_user = {}
      user = User.find(u.user_id)
      pp_url = user.profilepic.attached? ? url_for(user.profilepic) : ActionController::Base.helpers.asset_path('default_pp.png')

      single_user[:name] = user.name
      single_user[:id] = user.id
      single_user[:url] = pp_url

      userlist.push(single_user)
    end

    @current_user = current_user

    render json: { current_user: @current_user, userlist: userlist }
  end
end
