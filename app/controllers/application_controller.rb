# frozen_string_literal: true

class ApplicationController < ActionController::Base
  add_flash_types :info, :error, :warning
  protect_from_forgery with: :exception

  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) do |u|
      u.permit(:name, :profilepic, :email, :password, :password_confirmation)
    end

    devise_parameter_sanitizer.permit(:account_update) do |u|
      u.permit(:name, :profilepic, :email, :password, :current_password, :password_confirmation)
    end
  end
end
