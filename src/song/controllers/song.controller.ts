import { Controller, Inject, Get, Request } from '@nestjs/common';
import { SongService } from '../services';
import { Pagination } from '../../pagination';
import { SongDTO } from '../dto';

@Controller('songs')
export class SongController {
    @Inject()
    private readonly songService: SongService;

    @Get()
    async index(@Request() request): Promise<Pagination<SongDTO>> {
        return await this.songService.paginate({
            limit: request.query.hasOwnProperty('limit') ? request.query.limit : 20,
            page: request.query.hasOwnProperty('page') ? request.query.page : 0,
            keyword: request.query.hasOwnProperty('keyword') ? request.query.keyword : '',
        });
    }
}
