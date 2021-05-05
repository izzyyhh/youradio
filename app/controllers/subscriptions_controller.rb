class SubscriptionsController < ApplicationController
    def show
        server_id = params[:id]
        render json: { subscribed: !ServersUser.where(server_id: server_id, user_id: current_user.id).empty? }
    end

    def create
        p '----------------'
        p 'create subscription'
        server_id = params[:serverId]

        if ServersUser.where(server_id: server_id, user_id: current_user.id).empty?
            ServersUser.create(server_id: server_id, user_id: current_user.id)
        else
            p 'ignore'
        end
    end

    def destroy
        p '----------------'
        p 'delete subscription'
        server_id = params[:id]

        if ServersUser.where(server_id: server_id, user_id: current_user.id).empty?
            p 'ignore'
        else
            ServersUser.where(server_id: server_id, user_id: current_user.id).first.destroy
        end
    end
end
