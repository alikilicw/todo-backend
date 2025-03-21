import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { TodoService } from './todo.service'
import { CreateTodoDto, updateTodoDto } from './todo.dto'

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post()
    async create(@Body() createTodoDto: CreateTodoDto) {
        return this.todoService.create(createTodoDto)
    }

    @Get()
    async findAll() {
        return this.todoService.findAll()
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.todoService.findById(id)
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateTodoDto: updateTodoDto) {
        return this.todoService.update(id, updateTodoDto)
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.todoService.delete(id)
    }
}
