import { Controller, Inject, Get, Request, Param, Put, Post, UseGuards, UseInterceptors, UploadedFile, Body, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiConsumes,
    ApiImplicitFile,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { imageMulterilter } from '../../common/filters/multer.files.filter';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
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

    @Get('increment/view/:id')
    async incrementView(@Param('id') id): Promise<void> {
        return await this.albumService.incrementView(id);
    }

    @Get('increment/like/:id')
    async incrementLike(@Param('id') id): Promise<void> {
        return await this.albumService.incrementLike(id);
    }

    @Get('list/id')
    async getAllListId(): Promise<AlbumDTO[]> {
        return await this.albumService.getIdTitleList();
    }

    @Put()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar', {
        limits: {
            fileSize:  3 * 1024 * 1024, // 2 Mb
        },
        fileFilter: imageMulterilter,

    }))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'avatar', required: false })
    async edit(@UploadedFile() avatar, @Body(new ValidationPipe()) album: AlbumDTO) {
        return await this.albumService.editAlbum(album, avatar);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar', {
        limits: {
            fileSize:  3 * 1024 * 1024, // 2 Mb
        },
        fileFilter: imageMulterilter,

    }))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'avatar', required: false })
    async add(@UploadedFile() avatar, @Body(new ValidationPipe()) album: AlbumDTO) {
        return await this.albumService.addAlbum(album, avatar);
    }

}
