import {Injectable, Inject, Logger} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {slugify} from 'transliteration';
import {Song} from '../../entities/song.entity';
import {SongDTO} from '../../dto';
import {PaginationOptionsInterface, Pagination} from '../../../pagination';
import {PrettifyService} from '../prettify/prettify.service';
import {generateOrderFilter} from '../../../common/filters/typeorm.order.filter';

@Injectable()
export class SongService {
    private readonly songRepo: Repository<Song>;

    @Inject()
    private readonly prettifyService: PrettifyService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.songRepo = this.conection.getRepository(Song);
    }

    async getBySlugOrId(identificator: string): Promise<SongDTO> {
        const id = !isNaN(Number(identificator)) ? parseInt(identificator, 10) : -1;
        const song = await this.songRepo.findOne({
            where: [
                {id: id ? id : null},
                {slug: identificator},
            ],
            relations: ['tags'],
        });
        return song ? song.toResponseObject() : null;
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<SongDTO>> {
        const {keyword, limit, page, filter, tags, chords} = options;

        const query = this.songRepo
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.audioMp3', 'audioMp3')
            .leftJoinAndSelect('song.author', 'author')
            .leftJoinAndSelect('author.thumbnail', 'authorThumbnail')
            .leftJoinAndSelect('song.album', 'album')
            .leftJoinAndSelect('song.tags', 'tags')
            .leftJoinAndSelect('album.thumbnail', 'albumThumbnail')
            .where('LOWER(song.title) LIKE :search', {search: `%${keyword.toLowerCase()}%`});

        if (tags && tags !== 'null') {
            query.andWhere('tags.id IN (:...tagIds)', {tagIds: tags.split(',')});
        }

        if (chords === 'true') {
            query.andWhere('song.chords is not null');
        }

        const [results, total] = await query
            .orderBy({...generateOrderFilter(filter, 'song')})
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
        await this.songRepo
            .increment({id}, 'viewCount', 1);
    }

    async incrementLike(id: number) {
        await this.songRepo
            .increment({id}, 'likeCount', 1);
    }
}
