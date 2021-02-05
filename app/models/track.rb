# frozen_string_literal: true

class Track < ApplicationRecord
  belongs_to :playlist
end
