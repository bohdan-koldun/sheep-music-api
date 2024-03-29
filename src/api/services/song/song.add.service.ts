import {Injectable, Inject, HttpException, HttpStatus} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {slugify} from 'transliteration';
import {Song} from '../../entities/song.entity';
import {Album} from '../../entities/album.entity';
import {SongDTO} from '../../dto';
import {PrettifyService} from '../prettify/prettify.service';
import {User} from '../../../user/entities';

@Injectable()
export class SongAddService {
    private readonly songRepo: Repository<Song>;
    private readonly albumRepo: Repository<Album>;
    @Inject()
    private readonly prettifyService: PrettifyService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly connection: Connection,
    ) {
        this.songRepo = this.connection.getRepository(Song);
        this.albumRepo = this.connection.getRepository(Album);
    }

    async create(data: SongDTO, user: User): Promise<Song> {
        const { album } = data;
        let { author } = data;

        if (album && Number.isInteger(album.id)) {
            const {author: albumAuthor} = await this.albumRepo.findOne({where: {id: album.id}, relations: ['author']});

            if (author && author.id !== albumAuthor?.id) {
                throw new HttpException(`Альбом принадлежит другому исполнителю: ${albumAuthor.title}`, HttpStatus.BAD_REQUEST);
            }

            author = albumAuthor;
        }

        const createSong = slug => this.songRepo.save(
            {
                ...data,
                author,
                text: this.prettifyService.normalizeText(data.text),
                chords: this.prettifyService.normalizeText(data.chords),
                slug,
                owner: user,
            },
        );

        try {
            return await createSong(slugify(data.title));
        } catch (error) {
            return await createSong(`${slugify(data.title)}${Date.now()}`);
        }
    }
}
