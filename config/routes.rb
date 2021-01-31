Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "servers#index"

  resources :servers
  resources :chatmessages
  resources :servers_users

  post '/servers/broadcastrtc', to: 'broadcastrtc#create'

  mount ActionCable.server, at: '/cable'
end
