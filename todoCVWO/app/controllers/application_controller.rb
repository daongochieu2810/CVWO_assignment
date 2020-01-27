class ApplicationController < ActionController::Base
    #prevents rails from using its authenticity token
    skip_before_action :verify_authenticity_token
    
    #make sure all methods will be passed to all controllers in app
    helper_method :login!,:logged_in?,:current_user,:authorized_user?,:logout!

    def login!
        session[:user_id] = @user.id
    end

    def logged_in?
        !!session[:user_id]
    end

    def current_user
        @current_user ||=User.find(session[:user_id]) if session[:user_id]
    end

    def authorized_user?
        @user == current_user
    end

    def logout!
        session.clear
    end
    
end
