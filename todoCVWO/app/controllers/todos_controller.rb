class TodosController < ApplicationController
  def index
    todo = Todo.all.order(urgency_point: :desc)
    # all : get all datat from database
    # order: arrange by time created(desc = descending)
    render json: todo # send list as a json response
  end

  def create
    todo = Todo.create!(todo_params)
    if todo
      render json: todo
    else
      render json: todo.errors
    end
  end

  def show
    if todo
      render json: todo
    else
      render json: todo.errors
    end
  end

  def destroy
    todo&.destroy
    render json: { message: 'Todo deleted!'}
  end
  
  def update
   
    todo.update(todo_params)
    render json: todo

  end

  def todo_params
    params.permit(:title,:urgency_point,:deadline,:details,:done,{tags: []},:userID)
  end
  
  def todo
    @todo ||= Todo.find(params[:id])
  end
end
