
import { PaginationResultInterface } from './pagination.results.interface';

export class Pagination<PaginationEntity> {
    public curPage: number;
    public perPage: number;
    public total: number;
    public results: PaginationEntity[];

    constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
        this.curPage = paginationResults.curPage;
        this.perPage = paginationResults.results.length;
        this.total = paginationResults.total;
        this.results = paginationResults.results;
    }
}
