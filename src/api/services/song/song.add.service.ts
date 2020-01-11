import {Injectable, Inject} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {slugify} from 'transliteration';
import {Song} from '../../entities/song.entity';
import {SongDTO} from '../../dto';
import {PrettifyService} from '../prettify/prettify.service';
import {User} from '../../../user/entities';

@Injectable()
export class SongAddService {
    private readonly songRepo: Repository<Song>;
    @Inject()
    private readonly prettifyService: PrettifyService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly connection: Connection,
    ) {
        this.songRepo = this.connection.getRepository(Song);
    }

    async create(data: SongDTO, user: User): Promise<Song> {
        const createSong = slug => this.songRepo.save(
            {
                ...data,
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
