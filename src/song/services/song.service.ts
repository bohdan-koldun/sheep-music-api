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
        const { keyword, limit, page, filter } = options;

        console.log(this.songRepo
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.audioMp3', 'audioMp3')
            .leftJoinAndSelect('song.author', 'author')
            .leftJoinAndSelect('song.album', 'album')
            .where('song.title LIKE :keyword', { keyword: `%${ keyword.toLowerCase() }%` })
           // .orWhere('LOWER(song.title) LIKE LOWER(:keyword)', { keyword })
            .orderBy({ ...this.generateOrderFilter(filter) })
            .take(limit)
            .skip(limit * page).getQuery())

        const [results, total] = await this.songRepo
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.audioMp3', 'audioMp3')
            .leftJoinAndSelect('song.author', 'author')
            .leftJoinAndSelect('song.album', 'album')
            .where('LOWER(song.title COLLATE "en_US.UTF-8") LIKE :keyword', { keyword: `%${ keyword.toLowerCase() }%` })
           // .orWhere('LOWER(song.title) LIKE LOWER(:keyword)', { keyword })
            .orderBy({ ...this.generateOrderFilter(filter) })
            .take(limit)
            .skip(limit * page)
            .getManyAndCount();

        return new Pagination<SongDTO>({
            curPage: page,
            total,
            countPages: Math.ceil(total / limit),
            results: results.map(user => user.toResponseObject()) as unknown as SongDTO[],
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
