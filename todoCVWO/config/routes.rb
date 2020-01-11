Rails.application.routes.draw do
  get 'todos/index'
  get '/show/:id', to: 'todos#show'
  post 'todos/create'
  delete 'destroy/:id',to: 'todos#destroy'
  put '/update/:id',to: 'todos#update'

  get '/*path' => 'homepage#index'
  root 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
