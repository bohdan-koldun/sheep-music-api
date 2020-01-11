import { Controller, Inject, Get, Request, Param, UseGuards, Body, Put, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, GetUser } from '../../common/decorators';
import { SongService, PrettifyService, TagsService } from '../services';
import { Pagination } from '../../pagination';
import { SongDTO, TagDTO } from '../dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { User } from '../../user/entities';

@Controller('songs')
export class SongController {
    @Inject()
    private readonly songService: SongService;
    @Inject()
    private readonly tagsService: TagsService;
    @Inject()
    private readonly prettifyService: PrettifyService;

    @Get()
    async index(@Request() request): Promise<Pagination<SongDTO>> {
        return await this.songService.paginate({
            limit: request.query.hasOwnProperty('limit') ? request.query.limit : 20,
            page: request.query.hasOwnProperty('page') ? request.query.page : 0,
            keyword: request.query.hasOwnProperty('keyword') ? request.query.keyword : '',
            filter: request.query.hasOwnProperty('filter') ? request.query.filter : '',
            tags: request.query.hasOwnProperty('tags') ? request.query.tags : '',
        });
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<SongDTO> {
        return await this.songService.getBySlugOrId(id);
    }

    @Get('increment/view/:id')
    @HttpCode(204)
    async incrementView(@Param('id') id): Promise<void> {
        await this.songService.incrementView(id);
    }

    @Get('increment/like/:id')
    @HttpCode(204)
    async incrementLike(@Param('id') id): Promise<void> {
        await this.songService.incrementLike(id);
    }

    @Get('/tags/all')
    async allTags(): Promise<TagDTO[]> {
        return await this.tagsService.getSongTags();
    }

    @Put()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    async edit(@Body(new ValidationPipe()) song: SongDTO, @GetUser() authUser: User) {
        return await this.songService.editSong(song, authUser);
    }

    @Get('prettify/chords')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'))
    async prettify() {
        return await this.prettifyService.prettifyChords();
    }

    @Get('prettify/texts')
    @UseGuards(RolesGuard)
    @Roles('admin')
    @UseGuards(AuthGuard('jwt'))
    async prettifyText() {
        return await this.prettifyService.normalizeSongsText();
    }
}
