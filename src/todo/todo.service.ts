import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Todo } from './todo.model'
import { Model } from 'mongoose'
import { CreateTodoDto, FindTodoDto, FindTodoRes, UpdateTodoDto } from './todo.dto'
import { S3Service } from 'src/common/file-handling/s3.service'
import { User } from 'src/user/user.model'
import { OpenAiService } from 'src/common/openai/openai.service'

@Injectable()
export class TodoService {
    constructor(
        @InjectModel(Todo.name) private todoModel: Model<Todo>,
        private readonly s3Service: S3Service,
        private readonly openaiService: OpenAiService
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

        const recommendations = await this.openaiService.askChatGPT(createTodoDto.title)

        const createdTodo = new this.todoModel({
            title: createTodoDto.title,
            description: createTodoDto.description,
            thumbnailKey,
            fileKey,
            user: reqUser._id,
            recommendations
        })
        return createdTodo.save()
    }

    async findAll(): Promise<Todo[]> {
        return this.todoModel.find()
    }

    async findById(id: string): Promise<Todo | null> {
        return this.todoModel.findById(id)
    }

    async find(reqUser: User, findTodoDto: FindTodoDto): Promise<FindTodoRes> {
        const page = findTodoDto.page || 1
        const limit = findTodoDto.limit || 5

        let query = this.todoModel.find({ user: reqUser._id })

        if (findTodoDto.title) {
            query.find({ title: { $regex: findTodoDto.title, $options: 'i' } })
        }

        const total = await this.todoModel.countDocuments(query)

        // default page ve limit girmeyi unutma

        const todos = await query
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)

        return { total, page, limit, data: todos }
    }

    async update(reqUser: User, id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
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

        let updateParams: Partial<Todo> = {
            title: updateTodoDto.title,
            description: updateTodoDto.description,
            thumbnailKey,
            fileKey
        }

        if (updateTodoDto.title && todoControl.title != updateTodoDto.title) {
            const recommendations = await this.openaiService.askChatGPT(updateTodoDto.title)
            if (recommendations) updateParams.recommendations = recommendations
        }

        return this.todoModel.findByIdAndUpdate(id, updateParams, { new: true })
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
