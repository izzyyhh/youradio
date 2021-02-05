# frozen_string_literal: true

class Server < ApplicationRecord
  has_and_belongs_to_many :users
  has_many :chatmessages
  has_one :playlist
  has_one_attached :serverpic

  validates :serverpic, blob: { content_type: ['image/png', 'image/jpg', 'image/jpeg'], size_range: 1..5.megabytes }
end
