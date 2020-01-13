import {Injectable, Inject} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {Song} from '../../entities/song.entity';
import {User} from '../../../user/entities';

@Injectable()
export class SongFileService {
    private readonly songRepo: Repository<Song>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly connection: Connection,
    ) {
        this.songRepo = this.connection.getRepository(Song);
    }

    async addMp3Files(files: any, id, user: User): Promise<Song> {
        // TODO: logic

        return null;
    }

}
