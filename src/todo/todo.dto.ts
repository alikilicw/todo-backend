export type CreateTodoDtoFields = {
    title: string
    description?: string
}

export type CreateTodoDtoFiles = {
    thumbnail?: Express.Multer.File
    file?: Express.Multer.File
}

export type CreateTodoDto = CreateTodoDtoFields & CreateTodoDtoFiles

export type FindTodoDto = {
    title?: string
}

export type UpdateTodoDtoFields = {
    title: string
    description?: string
}

export type UpdateTodoDtoFiles = {
    thumbnail?: Express.Multer.File
    file?: Express.Multer.File
}

export type UpdateTodoDto = UpdateTodoDtoFields & UpdateTodoDtoFiles
