import { Controller, Inject, Get, Request, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators';
import { SongService, PrettifyService } from '../services';
import { Pagination } from '../../pagination';
import { SongDTO } from '../dto';
import { RolesGuard } from '../../common/guards/roles.guard';

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
            filter: request.query.hasOwnProperty('filter') ? request.query.filter : '',
        });
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<SongDTO> {
        return await this.songService.getBySlugOrId(id);
    }

    @Get('prettify/chords')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'))
    async prettify() {
        return await this.prettifyService.prettifyChords();
    }

}
