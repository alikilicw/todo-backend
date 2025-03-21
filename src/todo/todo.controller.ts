import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common'
import { TodoService } from './todo.service'
import { CreateTodoDto, FindTodoDto, updateTodoDto } from './todo.dto'
import { JoiValidationPipe } from 'src/common/validation/validation.pipe'
import TodoValidation from './todo.validation'

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post()
    @UsePipes(new JoiValidationPipe({ bodySchema: TodoValidation.create }))
    async create(@Body() createTodoDto: CreateTodoDto) {
        return this.todoService.create(createTodoDto)
    }

    @Get()
    @UsePipes(new JoiValidationPipe({ querySchema: TodoValidation.find }))
    async find(@Query() findTodoDto: FindTodoDto) {
        return this.todoService.find(findTodoDto)
    }

    @Get(':id')
    @UsePipes(new JoiValidationPipe({ paramSchema: TodoValidation.id }))
    async findById(@Param('id') params: { id: string }) {
        return this.todoService.findById(params.id)
    }

    @Patch(':id')
    @UsePipes(
        new JoiValidationPipe({ paramSchema: TodoValidation.id, bodySchema: TodoValidation.update })
    )
    async update(@Param('id') params: { id: string }, @Body() updateTodoDto: updateTodoDto) {
        return this.todoService.update(params.id, updateTodoDto)
    }

    @Delete(':id')
    @UsePipes(new JoiValidationPipe({ paramSchema: TodoValidation.id }))
    async delete(@Param('id') params: { id: string }) {
        return this.todoService.delete(params.id)
    }
}
