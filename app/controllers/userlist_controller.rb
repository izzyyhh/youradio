class UserlistController < ApplicationController

    def index
        @user = []
         
        @currentServersUser = ServersUser.where(server_id: params[:server_id]).where(is_admin: true)
        @currentServersUser.each do |n|
            @wrapper = []
            input = User.find(n.user_id)
            url_input = User.find(n.user_id).profilepic.attached? ? url_for(current_user.profilepic) : ActionController::Base.helpers.asset_path('default_pp.png')
            @wrapper.push(input, url_input)
            @user.push(@wrapper)
        end
        @current_user = current_user
        
        render json: {current_user: @current_user, currentServersUser: @currentServersUser, userList: @user }
    end
end
