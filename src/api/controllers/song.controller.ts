import {
    Controller,
    Inject,
    Get,
    Request,
    Param,
    UseGuards,
    Body,
    Put,
    HttpCode,
    Post,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Roles, GetUser} from '../../common/decorators';
import {SongService, PrettifyService, TagsService, SongAddService, SongFileService, SongEditService} from '../services';
import {Pagination} from '../../pagination';
import {SongDTO, TagDTO} from '../dto';
import {RolesGuard} from '../../common/guards/roles.guard';
import {ValidationPipe} from '../../common/pipes/validation.pipe';
import {User} from '../../user/entities';
import {FileFieldsInterceptor} from '@nestjs/platform-express';
import {ApiConsumes} from '@nestjs/swagger';
import {audioMulterFilter} from '../../common/filters/multer.files.filter';

@Controller('songs')
export class SongController {
    @Inject()
    private readonly songService: SongService;
    @Inject()
    private readonly songAddService: SongAddService;
    @Inject()
    private readonly songEditService: SongEditService;
    @Inject()
    private readonly songFileService: SongFileService;
    @Inject()
    private readonly tagsService: TagsService;
    @Inject()
    private readonly prettifyService: PrettifyService;

    @Get()
    async index(@Request() request): Promise<Pagination<SongDTO>> {
        const query = request.query;

        return await this.songService.paginate({
            limit: query.hasOwnProperty('limit') ? query.limit : 20,
            page: query.hasOwnProperty('page') ? query.page : 0,
            keyword: query.hasOwnProperty('keyword') ? query.keyword : '',
            filter: query.hasOwnProperty('filter') ? query.filter : '',
            tags: query.hasOwnProperty('tags') ? query.tags : '',
            chords: query.hasOwnProperty('chords') ? query.chords : '',
            minus: query.hasOwnProperty('minus') ? query.minus : '',
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
        return await this.songEditService.edit(song, authUser);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    async create(@Body(new ValidationPipe()) song: SongDTO, @GetUser() authUser: User) {
        return await this.songAddService.create(song, authUser);
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

    @Put('/audio/:id')
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileFieldsInterceptor(
        [
            {name: 'songMp3', maxCount: 1},
            {name: 'phonogramMp3', maxCount: 1},
        ],
        {
            limits: {
                fileSize: 14 * 1024 * 1024,
            },
            fileFilter: audioMulterFilter,
        },
    ))
    @ApiConsumes('multipart/form-data')
    async editAudio(@UploadedFiles() files, @Param('id') id, @GetUser() authUser: User) {
        return this.songFileService.addMp3Files(files, id, authUser);
    }
}
