import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { slugify } from 'transliteration';
import { Song } from '../entities/song.entity';
import { Tag } from '../entities/tag.entity';
import { SongDTO, TagDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';
import { PrettifyService } from './prettify.service';
import { User } from '../../user/entities';

@Injectable()
export class SongService {
    private readonly songRepo: Repository<Song>;
    private readonly tagRepo: Repository<Tag>;
    private readonly userRepo: Repository<User>;
    @Inject()
    private readonly prettifyService: PrettifyService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.songRepo = this.conection.getRepository(Song);
        this.tagRepo = this.conection.getRepository(Tag);
        this.userRepo = this.conection.getRepository(User);
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

    async editSong(song: SongDTO, user: User): Promise<SongDTO> {
        if (!await this.songRepo.findOne({ id: song.id })) {
            throw new HttpException('Ошибка редактирования!', HttpStatus.BAD_REQUEST);
        }

        song.text = this.prettifyService.normalizeText(song.text);
        song.chords = this.prettifyService.normalizeText(song.chords);
        delete song.slug;

        await this.songRepo.update({ id: song.id }, song);

        await this.saveSongUserRelation(user, song as Song);

        return await this.getBySlugOrId(String(song.id));
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<SongDTO>> {
        const { keyword, limit, page, filter, tags } = options;
        const query = this.songRepo
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.audioMp3', 'audioMp3')
            .leftJoinAndSelect('song.author', 'author')
            .leftJoinAndSelect('author.thumbnail', 'authorThumbnail')
            .leftJoinAndSelect('song.album', 'album')
            .leftJoinAndSelect('song.tags', 'tags')
            .leftJoinAndSelect('album.thumbnail', 'albumThumbnail')
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

    async incrementView(id: number) {
        await this.songRepo
        .increment({ id }, 'viewCount', 1);
    }

    async incrementLike(id: number) {
        await this.songRepo
        .increment({ id }, 'likeCount', 1);
    }

    private async saveSongUserRelation(user: User, song: Song) {

        if (song.id !== 0 && !song.id) { return; }

        const userSongs = await this.songRepo
            .createQueryBuilder('song')
            .select('song.id')
            .leftJoin('song.users', 'user')
            .where('user.id = :id', { id: user.id })
            .getMany();

        const ids = new Set((userSongs || []).map(item => item.id));

        ids.add(Number(song.id));

        user.songs = [...ids].map(id => ({ id } as Song));

        await this.userRepo.save(user);
    }
}
