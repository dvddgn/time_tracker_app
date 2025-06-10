class TimeLogsController < ApplicationController
  def index
    @time_logs = Current.user.time_logs.includes(:category).ordered_by_start_time
  end

  def new
    @time_log = Current.user.time_logs.build
    @categories = Current.user.categories.ordered_by_name
  end

  def create
    @time_log = Current.user.time_logs.build(time_log_params)

    if @time_log.save
      redirect_to time_logs_path, notice: "Time log was successfully created."
    else
      @categories = Current.user.categories.ordered_by_name
      render :new, status: :unprocessable_entity
    end
  end

  private

  def set_time_log
    @time_log = Current.user.time_logs.find(params[:id])
  end

  def time_log_params
    params.require(:time_log).permit(:category_id, :start_time, :end_time, :notes)
  end
end
