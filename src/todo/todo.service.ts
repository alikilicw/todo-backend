import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Todo } from './todo.model'
import { Model } from 'mongoose'
import { CreateTodoDto, FindTodoDto, UpdateTodoDto } from './todo.dto'
import { S3File, S3Service } from 'src/common/file-handling/s3.service'
import { User } from 'src/user/user.model'

@Injectable()
export class TodoService {
    constructor(
        @InjectModel(Todo.name) private todoModel: Model<Todo>,
        private readonly s3Service: S3Service
    ) {}

    async create(reqUser: User, createTodoDto: CreateTodoDto): Promise<Todo> {
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
            fileKey,
            user: reqUser._id
        })
        return createdTodo.save()
    }

    async findAll(): Promise<Todo[]> {
        return this.todoModel.find()
    }

    async findById(id: string): Promise<Todo | null> {
        return this.todoModel.findById(id)
    }

    async find(reqUser: User, findTodoDto: FindTodoDto): Promise<Todo[]> {
        let query = this.todoModel.find({ user: reqUser._id })

        if (findTodoDto.title) {
            query.find({ title: { $regex: findTodoDto.title, $options: 'i' } })
        }

        return query.sort({ createdAt: -1 })
    }

    async update(reqUser: User, id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
        console.log('id', id)
        console.log('updateTodoDto', updateTodoDto)

        const todoControl = await this.findById(id)
        if (!todoControl) throw new NotFoundException('Todo not found.')

        if (!todoControl.user.equals(reqUser.id))
            throw new UnauthorizedException('You are not authorized to update this todo.')

        let thumbnailKey: string | null
        let fileKey: string | null

        if (updateTodoDto.thumbnail) {
            const thumbnail = await this.s3Service.uploadFile({
                parentDir: 'thumbnails',
                ...updateTodoDto.thumbnail[0]
            })
            thumbnailKey = thumbnail.Key
        }

        if (updateTodoDto.file) {
            const file = await this.s3Service.uploadFile({
                parentDir: 'files',
                ...updateTodoDto.file[0]
            })
            fileKey = file.Key
        }

        return this.todoModel.findByIdAndUpdate(
            id,
            {
                title: updateTodoDto.title,
                description: updateTodoDto.description,
                thumbnailKey,
                fileKey
            },
            { new: true }
        )
    }

    async delete(reqUser: User, id: string): Promise<void> {
        const todoControl = await this.findById(id)
        if (!todoControl) throw new NotFoundException('Todo not found.')

        if (!todoControl.user.equals(reqUser.id))
            throw new UnauthorizedException('You are not authorized to delete this todo.')

        // Files can be deleted from s3 when todo delete

        await this.todoModel.findByIdAndDelete(id)
    }
}
