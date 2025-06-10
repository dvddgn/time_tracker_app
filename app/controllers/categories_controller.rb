class CategoriesController < ApplicationController
	# before_action :set_category, only: [ :edit, :update, :destroy ]

	def index
		@categories = Current.user.categories.ordered_by_name
	end

	def new
		@category = Current.user.categories.build
	end

	private

	def set_category
		@category = Current.user.categories.find(params[:id])
	end

	def category_params
		params.require(:category).permit(:name, :description)
	end
end
