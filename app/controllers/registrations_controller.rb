class RegistrationsController < ApplicationController
	allow_unauthenticated_access
	before_action :resume_session

	def new
		@user = User.new
	end

	def create
		@user = User.new(user_params)
		if @user.save
			start_new_session_for @user
			redirect_to root_path
		else
			flash.now[:alert] = @user.errors.full_messages.join(', ')
			render :new, status: :unprocessable_entity
		end
	end

	private

	def user_params
		params.require(:user).permit(:email_address, :password, :password_confirmation)
	end
end