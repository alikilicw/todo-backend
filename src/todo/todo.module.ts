import { Module } from '@nestjs/common'
import { TodoService } from './todo.service'
import { TodoController } from './todo.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Todo, TodoSchema } from './todo.model'
import { CommonModule } from 'src/common/common.module'

@Module({
    imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]), CommonModule],
    providers: [TodoService],
    controllers: [TodoController]
})
export class TodoModule {}
