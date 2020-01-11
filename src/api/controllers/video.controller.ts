import { Controller, Inject, Get, Request, Param } from '@nestjs/common';
import { VideoService } from '../services';
import { Pagination } from '../../pagination';
import { SongDTO } from '../dto';

@Controller('videos')
export class VideoController {
    @Inject()
    private readonly videoService: VideoService;

    @Get()
    async index(@Request() request): Promise<Pagination<SongDTO>> {
        return await this.videoService.paginate({
            limit: request.query.hasOwnProperty('limit') ? request.query.limit : 20,
            page: request.query.hasOwnProperty('page') ? request.query.page : 0,
            keyword: request.query.hasOwnProperty('keyword') ? request.query.keyword : '',
            filter: request.query.hasOwnProperty('filter') ? request.query.filter : '',
        });
    }

    @Get(':id')
    async findOne(@Param('id') id): Promise<SongDTO> {
        return await this.videoService.getBySlugOrId(id);
    }
}
