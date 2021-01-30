class ServersUsersController < ApplicationController
    def new
        @servers_users = ServersUser.new
        @server_id = params[:server_id]
    end

    def create
        new_member_assoc = ServersUser.new
        new_member = User.where(email: params[:user_email]).first
        
        if new_member.nil?
            redirect_to request.referrer, notice: "member couldn't be found, please check the email adress"
            return
        end

        affected_server =  Server.find(params[:servers_user][:server_id])

        new_member_assoc.user_id = new_member.id
        new_member_assoc.server_id = affected_server.id

        if new_member_assoc.save
            redirect_to affected_server, notice: "member added successfully"
        else
            redirect_to affected_server, notice: "failed adding member"
        end
    end
end
