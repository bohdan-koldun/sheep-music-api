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

    async getBySlugOrId(identificator: string): Promise<SongDTO> {
        const id = parseInt(identificator, 10);
        const song = await this.songRepo.findOne({
            where: [
                { id: id ? id : null },
                { slug: identificator },
            ],
        });
        return song ? song.toResponseObject() : null;
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<SongDTO>> {
        const { keyword, limit, page } = options;
        const [results, total] = await this.songRepo.findAndCount({
            where: { title: Like('%' + keyword + '%') },
            // TODO order: { title: 'DESC' },
            take: limit,
            skip: limit * page ,
        });

        return new Pagination<SongDTO>({
            curPage: page,
            total,
            countPages: Math.ceil(total / limit),
            results: results.map(user => user.toResponseObject()) as unknown as SongDTO[],
        });
    }
}
