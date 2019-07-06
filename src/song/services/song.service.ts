import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository, Like } from 'typeorm';
import { Song } from '../entities/song.entity';
import { SongDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';

@Injectable()
export class SongService {
    private readonly songRepo: Repository<Song>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.songRepo = this.conection.getRepository(Song);
    }

    async getSongList(): Promise<SongDTO[]> {
        const users = await this.songRepo.find();
        return users.map(user => user.toResponseObject()) as unknown as SongDTO[];
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<SongDTO>> {

        const [results, total] = await this.songRepo.findAndCount({
            where: { title: Like('%' + options.keyword + '%') }, order: { title: 'DESC' },
            take: options.limit,
            skip: options.page,
        });

        return new Pagination<SongDTO>({
            total,
            results: results.map(user => user.toResponseObject()) as unknown as SongDTO[],
        });
    }
}
