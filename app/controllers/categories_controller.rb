class CategoriesController < ApplicationController
	def index
		@categories = Current.user.categories.ordered_by_name
	end

	def new
		@category = Current.user.categories.build
	end

	def create
    @category = Current.user.categories.build(category_params)

    if @category.save
      redirect_to categories_path, notice: "Category was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

	private

	def set_category
		@category = Current.user.categories.find(params[:id])
	end

	def category_params
		params.require(:category).permit(:name, :description)
	end
end
