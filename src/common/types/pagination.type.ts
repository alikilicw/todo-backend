export type Pagination = {
    limit?: number
    page?: number
}

export type PaginationRes = Required<Pagination> & {
    total: number
}
