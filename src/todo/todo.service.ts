import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Todo } from './todo.model'
import { Model } from 'mongoose'
import { CreateTodoDto, FindTodoDto, updateTodoDto } from './todo.dto'

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private todoModel: Model<Todo>) {}

    async create(createTodoDto: CreateTodoDto): Promise<Todo> {
        const createdTodo = new this.todoModel(createTodoDto)
        return createdTodo.save()
    }

    async findAll(): Promise<Todo[]> {
        return this.todoModel.find()
    }

    async findById(id: string): Promise<Todo | null> {
        return this.todoModel.findById(id)
    }

    async find(findTodoDto: FindTodoDto): Promise<Todo[]> {
        return this.todoModel.find(findTodoDto)
    }

    async update(id: string, updateTodoDto: updateTodoDto): Promise<Todo> {
        const todoControl = await this.findById(id)
        if (!todoControl) throw new NotFoundException('Todo not found.')

        return this.todoModel.findByIdAndUpdate(id, updateTodoDto, { new: true })
    }

    async delete(id: string): Promise<void> {
        const todoControl = await this.findById(id)
        if (!todoControl) throw new NotFoundException('Todo not found.')

        this.todoModel.findByIdAndDelete(id)
    }
}
