import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Song } from '../entities/song.entity';
import { SongDTO } from '../dto';

@Injectable()
export class SongService {
    @Inject('DATABASE_CONNECTION')
    private readonly conection: Connection;

    async getSongList(): Promise<SongDTO[]> {
        const users = await this.conection
            .getRepository(Song)
            .find();

        return users.map(user => user.toResponseObject()) as unknown as SongDTO[];
    }
}
