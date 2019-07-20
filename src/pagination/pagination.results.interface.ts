export interface PaginationResultInterface<PaginationEntity> {
    total: number;
    results: PaginationEntity[];
    curPage: number;
    perPage?: number;
    countPages: number;
}
