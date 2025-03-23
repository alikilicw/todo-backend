import { PaginationRes } from './pagination.type'
export type Response<T> = {
    data?: T
    message?: string
}

export type PaginationResponse<T> = Response<T> & PaginationRes
