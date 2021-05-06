# frozen_string_literal: true

class ActiveUserlist < ApplicationRecord
  belongs_to :server
  belongs_to :user
end
