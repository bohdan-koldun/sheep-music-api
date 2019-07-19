import { Controller, Inject, Get, Request, Param } from '@nestjs/common';
import { SongService, PrettifyService } from '../services';
import { Pagination } from '../../pagination';
import { SongDTO } from '../dto';

@Controller('songs')
export class SongController {
    @Inject()
    private readonly songService: SongService;
    @Inject()
    private readonly prettifyService: PrettifyService;

    @Get()
    async index(@Request() request): Promise<Pagination<SongDTO>> {
        return await this.songService.paginate({
            limit: request.query.hasOwnProperty('limit') ? request.query.limit : 20,
            page: request.query.hasOwnProperty('page') ? request.query.page : 0,
            keyword: request.query.hasOwnProperty('keyword') ? request.query.keyword : '',
        });
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<SongDTO> {
        return await this.songService.getBuSlugOrId(id);
    }

    @Get('prettify/chords')
    async prettify() {
        return await this.prettifyService.prettifyChords();
    }

}
