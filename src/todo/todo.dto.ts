export type CreateTodoDto = {
    title: string
    description?: string
}

export type FindTodoDto = {
    title?: string
}

export type updateTodoDto = CreateTodoDto
