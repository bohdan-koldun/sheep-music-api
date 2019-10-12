import { Injectable, Inject, Logger } from '@nestjs/common';
import { Connection, Repository, Like } from 'typeorm';
import { slugify } from 'transliteration';
import { Song } from '../entities/song.entity';
import { Tag } from '../entities/tag.entity';
import { SongDTO, TagDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';

@Injectable()
export class SongService {
    private readonly songRepo: Repository<Song>;
    private readonly tagRepo: Repository<Tag>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.songRepo = this.conection.getRepository(Song);
        this.tagRepo = this.conection.getRepository(Tag);
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

    async getSongTags(): Promise<TagDTO[]> {
        return await this.tagRepo.find();
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<SongDTO>> {
        const { keyword, limit, page, filter, tags } = options;
        const query = this.songRepo
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.audioMp3', 'audioMp3')
            .leftJoinAndSelect('song.author', 'author')
            .leftJoinAndSelect('song.album', 'album')
            .leftJoinAndSelect('song.tags', 'tags')
            .leftJoinAndSelect('album.thumbnail', 'thumbnail')
            .where('LOWER(song.title) LIKE :search', { search: `%${keyword.toLowerCase()}%` });

        if (tags && tags !== 'null') {
            query.andWhere('tags.id IN (:...tagIds)', { tagIds: tags.split(',') });
        }

        const [results, total] = await query
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

    async changeSlugs() {
        let result = [];
        let page = 0;

        do {
            result = await this.songRepo
                .createQueryBuilder('song')
                .take(200)
                .skip(page * 200)
                .getMany();

            await Promise.all(
                result.map(
                    async (song) => {
                        try {
                            if (song && song.title) {
                                song.slug = slugify(song.title);
                                await this.songRepo.save(song);
                            }

                        } catch (error) {
                            try {
                                if (song && song.title) {
                                    song.slug = slugify(song.title) + Date.now();
                                    await this.songRepo.save(song);
                                }
                            } catch (error) {
                                Logger.error(error.message, error);
                            }
                        }
                    },
                ),
            );
            page++;

        } while (result && result.length);

        return 'done change slugs';
    }
}
