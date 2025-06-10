class CategoriesController < ApplicationController
	before_action :set_category, only: [ :edit, :update, :destroy ]

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

	def edit
    # @category is set by before_action
  end

  def update
    if @category.update(category_params)
      redirect_to categories_path, notice: "Category was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

	def destroy
    @category.destroy
    redirect_to categories_path, notice: "Category was successfully deleted."
  end

	private

	def set_category
		@category = Current.user.categories.find(params[:id])
	end

	def category_params
		params.require(:category).permit(:name, :description)
	end
end
