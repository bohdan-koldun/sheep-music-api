import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Song } from '../../entities/song.entity';
import { SongViewLog } from '../../entities/song.view.log.entity';
import { SongDTO } from '../../dto';
import { PaginationOptionsInterface, Pagination } from '../../../pagination';
import { generateOrderFilter } from '../../../common/filters/typeorm.order.filter';

@Injectable()
export class SongService {
    private readonly songRepo: Repository<Song>;
    private readonly songViewLogRepo: Repository<SongViewLog>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly connection: Connection,
    ) {
        this.songRepo = this.connection.getRepository(Song);
        this.songViewLogRepo = this.connection.getRepository(SongViewLog);
    }

    async getBySlugOrId(identificator: string): Promise<SongDTO> {
        const id = !isNaN(Number(identificator)) ? parseInt(identificator, 10) : -1;
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
        const { keyword, limit, page, filter, tags } = options;
        const { chords, minus, languages } = options;

        const query = this.songRepo
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.audioMp3', 'audioMp3')
            .leftJoin('song.phonogramMp3', 'phonogramMp3')
            .leftJoinAndSelect('song.author', 'author')
            .leftJoinAndSelect('author.thumbnail', 'authorThumbnail')
            .leftJoinAndSelect('song.album', 'album')
            .leftJoinAndSelect('song.tags', 'tags')
            .leftJoinAndSelect('album.thumbnail', 'albumThumbnail')
            .where('LOWER(song.title) LIKE :search', { search: `%${keyword.toLowerCase()}%` });

        if (tags && tags !== 'null') {
            query.andWhere('tags.id IN (:...tagIds)', { tagIds: tags.split(',') });
        }

        if (chords === 'true') {
            query.andWhere('song.chords is not null');
        }

        if (minus === 'true') {
            query.andWhere('song.phonogramMp3 is not null');
        }

        if (languages && languages !== 'null') {
            query.andWhere('song.language IN (:...languages)', { languages: languages.split(',') });
        }

        const [results, total] = await query
            .orderBy({ ...generateOrderFilter(filter, 'song') })
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

    async incrementView(id: number) {
        const song = { id };

        await this.songRepo
            .increment(song, 'viewCount', 1);

        const date = new Date(
            new Date(Date.now()).toLocaleString().split(',')[0],
        );

        let songViewLog = await this.songViewLogRepo.findOne({ date, song });

        if (!songViewLog) {
            songViewLog = await this.songViewLogRepo.save({ date, song });
        }

        await this.songViewLogRepo
            .increment({ id: songViewLog.id }, 'count', 1);
    }

    async incrementLike(id: number) {
        await this.songRepo
            .increment({ id }, 'likeCount', 1);
    }
}
