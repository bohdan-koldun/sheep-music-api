import { Controller, Inject, Get, Request, Param, Put, UseGuards, Body, ValidationPipe, UseInterceptors, UploadedFile, Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiConsumes,
    ApiImplicitFile,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { imageMulterilter } from '../../common/filters/multer.files.filter';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards/roles.guard';
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
    @Get('list/id')
    async getAllListId(): Promise<AuthorDTO[]> {
        return await this.authorService.getIdTitleList();
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
    async edit(@UploadedFile() avatar, @Body(new ValidationPipe()) author: AuthorDTO) {
        return await this.authorService.editAuthor(author, avatar);
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
    async add(@UploadedFile() avatar, @Body(new ValidationPipe()) author: AuthorDTO) {
        return await this.authorService.addAuthor(author, avatar);
    }

}
