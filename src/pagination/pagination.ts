
import { PaginationResultInterface } from './pagination.results.interface';

export class Pagination<PaginationEntity> {
    public curPage: number;
    public perPage: number;
    public countPages: number;
    public total: number;
    public results: PaginationEntity[];

    constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
        this.curPage = paginationResults.curPage;
        this.perPage = paginationResults.results.length;
        this.countPages = paginationResults.countPages;
        this.total = paginationResults.total;
        this.results = paginationResults.results;
    }
}
