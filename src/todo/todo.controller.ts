import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes
} from '@nestjs/common'
import { TodoService } from './todo.service'
import {
    CreateTodoDto,
    CreateTodoDtoFields,
    CreateTodoDtoFiles,
    FindTodoDto,
    UpdateTodoDto,
    UpdateTodoDtoFields,
    UpdateTodoDtoFiles
} from './todo.dto'
import { JoiValidationPipe } from 'src/common/validation/validation.pipe'
import TodoValidation from './todo.validation'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { MulterService } from 'src/common/file-handling/multer.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { Request } from 'express'
import { User } from 'src/user/user.model'
@UseGuards(JwtAuthGuard)
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
        @Req() req: Request,
        @Body() createTodoDto: CreateTodoDtoFields,
        @UploadedFiles() files: CreateTodoDtoFiles
    ) {
        const reqUser = req.user as User

        return this.todoService.create(reqUser, { ...createTodoDto, ...files })
    }

    @Get()
    @UsePipes(new JoiValidationPipe({ querySchema: TodoValidation.find }))
    async find(@Req() req: Request, @Query() findTodoDto: FindTodoDto) {
        const reqUser = req.user! as User

        return this.todoService.find(reqUser, findTodoDto)
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
    async update(
        @Req() req: Request,
        @Param() params: { id: string },
        @Body() updateTodoDto: UpdateTodoDtoFields,
        @UploadedFiles() files: UpdateTodoDtoFiles
    ) {
        const reqUser = req.user! as User

        return this.todoService.update(reqUser, params.id, { ...updateTodoDto, ...files })
    }

    @Delete(':id')
    @UsePipes(new JoiValidationPipe({ paramSchema: TodoValidation.id }))
    async delete(@Req() req: Request, @Param() params: { id: string }) {
        const reqUser = req.user! as User

        return this.todoService.delete(reqUser, params.id)
    }
}
