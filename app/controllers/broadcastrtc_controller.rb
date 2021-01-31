class BroadcastrtcController < ApplicationController
    def create
        head :no_content
        server_id = broadcast_params.to_h[:server_id]

        ActionCable.server.broadcast "server_channel_#{server_id}", broadcast_params
    end

    private

    def broadcast_params
        params.require(:broadcastrtc).permit(:type, :from, :to, :sdp, :candidate, :server_id)
    end
end
#server id ueber fetch formular
