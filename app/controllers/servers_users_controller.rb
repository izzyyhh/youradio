# frozen_string_literal: true

# used for server-user association, many to many
class ServersUsersController < ApplicationController
  def new
    @servers_users = ServersUser.new
    @server_id = params[:server_id]
  end

  def create
    users_selected_emails = params[:users]
    affected_server = Server.find(params[:servers_user][:server_id])

    handle_user_selection(users_selected_emails, affected_server)
  end

  private

  def handle_user_selection(users_selected_emails, affected_server)
    if users_selected_emails.nil?
      redirect_to affected_server, notice: 'Kein User hinzugefügt'
      return false
    else
      create_server_user_assoc(users_selected_emails, affected_server)
    end
    redirect_to affected_server, notice: 'added succesfully'
    true
  end
end

def create_server_user_assoc(users_selected_emails, affected_server)
  users_selected_emails.each do |email|
    new_member_assoc = ServersUser.new
    new_member = User.where(email: email).first

    new_member_assoc.user_id = new_member.id
    new_member_assoc.server_id = affected_server.id

    unless new_member_assoc.save
      redirect_to affected_server, notice: 'failed adding member'
      return false
    end
  end
end
