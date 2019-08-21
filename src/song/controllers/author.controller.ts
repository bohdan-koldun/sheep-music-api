import { Controller, Inject, Get, Request, Param } from '@nestjs/common';
import { AuthorService } from '../services';
import { Pagination } from '../../pagination';
import { AuthorDTO } from '../dto';

@Controller('authors')
export class AuthorController {
    @Inject()
    private readonly authorService: AuthorService;

    @Get()
    async index(@Request() request): Promise<Pagination<AuthorDTO>> {
        return await this.authorService.paginate({
            limit: request.query.hasOwnProperty('limit') ? request.query.limit : 20,
            page: request.query.hasOwnProperty('page') ? request.query.page : 0,
            keyword: request.query.hasOwnProperty('keyword') ? request.query.keyword : '',
            filter: request.query.hasOwnProperty('filter') ? request.query.filter : '',
        });
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<AuthorDTO> {
        return await this.authorService.getBySlugOrId(id);
    }

}
