import { Pagination } from 'src/common/types/pagination.type'
import { PaginationResponse } from 'src/common/types/response.type'
import { Todo } from './todo.model'

export type CreateTodoDtoFields = {
    title: string
    description?: string
}

export type CreateTodoDtoFiles = {
    thumbnail?: Express.Multer.File
    file?: Express.Multer.File
}

export type CreateTodoDto = CreateTodoDtoFields & CreateTodoDtoFiles

export type FindTodoDto = Pagination & {
    title?: string
}

export type FindTodoRes = PaginationResponse<Todo[]>

export type UpdateTodoDtoFields = {
    title: string
    description?: string
}

export type UpdateTodoDtoFiles = {
    thumbnail?: Express.Multer.File
    file?: Express.Multer.File
}

export type UpdateTodoDto = UpdateTodoDtoFields & UpdateTodoDtoFiles
