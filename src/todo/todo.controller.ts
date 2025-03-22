import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    UsePipes
} from '@nestjs/common'
import { TodoService } from './todo.service'
import {
    CreateTodoDto,
    CreateTodoDtoFields,
    CreateTodoDtoFiles,
    FindTodoDto,
    UpdateTodoDto
} from './todo.dto'
import { JoiValidationPipe } from 'src/common/validation/validation.pipe'
import TodoValidation from './todo.validation'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { MulterService } from 'src/common/file-handling/multer.service'
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post()
    @UsePipes(new JoiValidationPipe({ bodySchema: TodoValidation.create }))
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'thumbnail', maxCount: 1 },
                { name: 'file', maxCount: 1 }
            ],
            {
                storage: MulterService.storage,
                fileFilter: MulterService.fileFilter
            }
        )
    )
    async create(
        @Body() createTodoDto: CreateTodoDtoFields,
        @UploadedFiles() files: CreateTodoDtoFiles
    ) {
        return this.todoService.create({ ...createTodoDto, ...files })
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
    async update(@Param('id') params: { id: string }, @Body() updateTodoDto: UpdateTodoDto) {
        return this.todoService.update(params.id, updateTodoDto)
    }

    @Delete(':id')
    @UsePipes(new JoiValidationPipe({ paramSchema: TodoValidation.id }))
    async delete(@Param('id') params: { id: string }) {
        return this.todoService.delete(params.id)
    }
}
