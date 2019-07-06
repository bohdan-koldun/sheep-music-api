export interface PaginationResultInterface<PaginationEntity> {
    total: number;
    results: PaginationEntity[];
    next?: string;
    previous?: string;
}
