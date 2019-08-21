import { Controller, Inject, Get, Request, Param } from '@nestjs/common';
import { AlbumService } from '../services';
import { Pagination } from '../../pagination';
import { AlbumDTO } from '../dto';

@Controller('albums')
export class AlbumController {
    @Inject()
    private readonly albumService: AlbumService;

    @Get()
    async index(@Request() request): Promise<Pagination<AlbumDTO>> {
        return await this.albumService.paginate({
            limit: request.query.hasOwnProperty('limit') ? request.query.limit : 20,
            page: request.query.hasOwnProperty('page') ? request.query.page : 0,
            keyword: request.query.hasOwnProperty('keyword') ? request.query.keyword : '',
            filter:  request.query.hasOwnProperty('filter') ? request.query.filter : '',
        });
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<AlbumDTO> {
        return await this.albumService.getBySlugOrId(id);
    }

}
