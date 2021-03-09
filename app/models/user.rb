# frozen_string_literal: true

# model for the user, user_not_added lists all users which are not part of a certain server
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_and_belongs_to_many :servers
  has_one_attached :profilepic

  validates :profilepic, blob: { content_type: ['image/png', 'image/jpg', 'image/jpeg'], size_range: 1..5.megabytes }

  def self.users_not_added_to_server(server_id)
    users = User.all
    users_already_added = User.joins(:servers_users).where(servers_users: { server_id: server_id })

    users.reject { |u| users_already_added.include?(u) }
  end

  def self.part_of_server?(server_id, user)
    users_already_added = User.joins(:servers_users).where(servers_users: { server_id: server_id })

    users_already_added.include?(user)
  end
end
