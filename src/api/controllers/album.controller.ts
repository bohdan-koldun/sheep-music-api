import {
    Controller, Inject, Get, Request, Param, Put, Post, UseGuards,
    UseInterceptors, UploadedFile, Body, HttpCode, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiConsumes,
    ApiImplicitFile,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { imageMulterFilter } from '../../common/filters/multer.files.filter';
import {ValidationPipe} from '../../common/pipes/validation.pipe';
import { Roles, GetUser } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AlbumService } from '../services';
import { Pagination } from '../../pagination';
import { AlbumDTO } from '../dto';
import { User } from '../../user/entities';

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
            filter: request.query.hasOwnProperty('filter') ? request.query.filter : '',
        });
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<AlbumDTO> {
        return await this.albumService.getBySlugOrId(id);
    }

    @Get('increment/view/:id')
    @HttpCode(204)
    async incrementView(@Param('id') id): Promise<void> {
        await this.albumService.incrementView(id);
    }

    @Get('increment/like/:id')
    @HttpCode(204)
    async incrementLike(@Param('id') id): Promise<void> {
        await this.albumService.incrementLike(id);
    }

    @Get('list/id')
    async getAllListId(@Query() query): Promise<AlbumDTO[]> {
        return await this.albumService.getIdTitleList(query.authorId);
    }

    @Put()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar', {
        limits: {
            fileSize: 3 * 1024 * 1024, // 3 Mb
        },
        fileFilter: imageMulterFilter,

    }))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'avatar', required: false })
    async edit(@UploadedFile() avatar, @Body(new ValidationPipe()) album: AlbumDTO, @GetUser() authUser: User) {
        return await this.albumService.editAlbum(album, avatar, authUser);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar', {
        limits: {
            fileSize: 3 * 1024 * 1024,
        },
        fileFilter: imageMulterFilter,

    }))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'avatar', required: false })
    async add(@UploadedFile() avatar, @Body(new ValidationPipe()) album: AlbumDTO, @GetUser() authUser: User) {
        return await this.albumService.addAlbum(album, avatar, authUser);
    }

}
