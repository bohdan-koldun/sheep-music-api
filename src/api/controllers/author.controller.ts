import {
    Controller, Inject, Get, Request, Param, Put, UseGuards, Body,
    UseInterceptors, UploadedFile, Post, HttpCode, Query,
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
import { AuthorService } from '../services';
import { Pagination } from '../../pagination';
import { AuthorDTO } from '../dto';
import { User } from '../../user/entities';

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

    @Get('increment/view/:id')
    @HttpCode(204)
    async incrementView(@Param('id') id): Promise<void> {
        await this.authorService.incrementView(id);
    }

    @Get('increment/like/:id')
    @HttpCode(204)
    async incrementLike(@Param('id') id): Promise<void> {
        await this.authorService.incrementLike(id);
    }

    @Get('list/id')
    async getAllListId(@Query() query): Promise<AuthorDTO[]> {
        return await this.authorService.getIdTitleList(query.albumId);
    }

    @Put()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar', {
        limits: {
            fileSize: 3 * 1024 * 1024, // 2 Mb
        },
        fileFilter: imageMulterFilter,

    }))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'avatar', required: false })
    async edit(@UploadedFile() avatar, @Body(new ValidationPipe()) author: AuthorDTO,  @GetUser() authUser: User) {
        return await this.authorService.editAuthor(author, avatar, authUser);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('avatar', {
        limits: {
            fileSize: 3 * 1024 * 1024, // 2 Mb
        },
        fileFilter: imageMulterFilter,

    }))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'avatar', required: false })
    async add(@UploadedFile() avatar, @Body(new ValidationPipe()) author: AuthorDTO,  @GetUser() authUser: User) {
        return await this.authorService.addAuthor(author, avatar, authUser);
    }

}
