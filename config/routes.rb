Rails.application.routes.draw do
  get 'tracks/new'
  get 'tracks/create'
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :servers
  resources :chatmessages
  resources :servers_users
  resources :tracks
  
  root to: "servers#index"
end
