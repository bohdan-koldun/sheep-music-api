import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Song } from '../entities/song.entity';
import { SongDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';

@Injectable()
export class VideoService {
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
            relations: ['tags'],
        });
        return song ? song.toResponseObject() : null;
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<SongDTO>> {
        const { keyword, limit, page, filter } = options;

        const [results, total] = await this.songRepo
            .createQueryBuilder('song')
            .select(['song.id', 'song.slug', 'song.title', 'song.video'])
            .where('LOWER(song.title) LIKE :search', { search: `%${keyword.toLowerCase()}%` })
            .andWhere('song.video is not null')
            .orderBy({ ...this.generateOrderFilter(filter) })
            .take(limit)
            .skip(limit * page)
            .getManyAndCount();

        return new Pagination<SongDTO>({
            curPage: page,
            total,
            countPages: Math.ceil(total / limit),
            results: results.map(song => song.toResponseObject()) as unknown as SongDTO[],
        });
    }

    private generateOrderFilter(filter: string): any {
        const order = {};
        if (filter === 'revert_alphabet') {
            order['song.title'] = 'DESC';
        }

        if (filter === 'alphabet') {
            order['song.title'] = 'ASC';
        }
        if (filter === 'newest') {
            order['song.createdAt'] = 'ASC';
        }

        return order;
    }
}