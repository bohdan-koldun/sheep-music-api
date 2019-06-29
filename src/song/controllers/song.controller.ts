import { Controller, Res, HttpStatus, Inject, Get } from '@nestjs/common';
import { Response } from 'express';
import { SongService } from '../services';

@Controller('songs')
export class SongController {
    @Inject()
    private readonly songService: SongService;

    @Get()
    async index(@Res() res: Response) {
        const songs = await this.songService.getSongList();
        res.status(HttpStatus.OK).json({
            total: songs.length,
            data: songs,
        });
    }
}
