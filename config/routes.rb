Rails.application.routes.draw do

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Authentication routes (added by generator)
  resource :session
  resources :passwords, param: :token
  resource :registrations, only: [:new, :create]

  # Categories resource - excluding show action
  resources :categories, except: [ :show ]

  # Time logs resource - excluding show action
  resources :time_logs, except: [ :show ]

  # Pages routes
  get "pages/home"
  get "pages/about"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "pages#home"
end
