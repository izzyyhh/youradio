# frozen_string_literal: true

class ServersUser < ApplicationRecord
  belongs_to :user
  belongs_to :server
end
