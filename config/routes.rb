# frozen_string_literal: true

Rails.application.routes.draw do
  get 'hello_world', to: 'hello_world#index'
  get 'tracks/new'
  get 'tracks/create'

  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :servers do
    resources :playlist
    resources :userlist
  end

  resources :chatmessages
  resources :servers_users
  resources :tracks
  resources :reactions
  resources :subscriptions

  root to: 'servers#index'
end
