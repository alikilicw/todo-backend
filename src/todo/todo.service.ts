import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Todo } from './todo.model'
import { Model } from 'mongoose'
import { CreateTodoDto, FindTodoDto, UpdateTodoDto } from './todo.dto'
import { S3File, S3Service } from 'src/common/file-handling/s3.service'

@Injectable()
export class TodoService {
    constructor(
        @InjectModel(Todo.name) private todoModel: Model<Todo>,
        private readonly s3Service: S3Service
    ) {}

    async create(createTodoDto: CreateTodoDto): Promise<Todo> {
        let thumbnailKey: string | null
        let fileKey: string | null

        if (createTodoDto.thumbnail) {
            const thumbnail = await this.s3Service.uploadFile({
                parentDir: 'thumbnails',
                ...createTodoDto.thumbnail[0]
            })
            thumbnailKey = thumbnail.Key
        }

        if (createTodoDto.file) {
            const file = await this.s3Service.uploadFile({
                parentDir: 'files',
                ...createTodoDto.file[0]
            })
            fileKey = file.Key
        }

        const createdTodo = new this.todoModel({
            title: createTodoDto.title,
            description: createTodoDto.description,
            thumbnailKey,
            fileKey
        })
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

    async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
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
