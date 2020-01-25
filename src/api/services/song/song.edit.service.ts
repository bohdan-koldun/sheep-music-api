import {Injectable, Inject, HttpException, HttpStatus} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {Song} from '../../entities/song.entity';
import {Album} from '../../entities/album.entity';
import {SongDTO} from '../../dto';
import {PrettifyService} from '../prettify/prettify.service';
import {User} from '../../../user/entities';

@Injectable()
export class SongEditService {
    private readonly songRepo: Repository<Song>;
    private readonly albumRepo: Repository<Album>;
    private readonly userRepo: Repository<User>;

    @Inject()
    private readonly prettifyService: PrettifyService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly connection: Connection,
    ) {
        this.songRepo = this.connection.getRepository(Song);
        this.albumRepo = this.connection.getRepository(Album);
        this.userRepo = this.connection.getRepository(User);
    }

    async edit(data: SongDTO, user: User): Promise<Song> {
        if (!await this.songRepo.findOne({id: data.id})) {
            throw new HttpException('Нет такой песни!', HttpStatus.BAD_REQUEST);
        }

        const { album } = data;
        let { author } = data;

        if (album && Number.isInteger(album.id)) {
            const {author: albumAuthor} = await this.albumRepo.findOne({where: {id: album.id}, relations: ['author']});

            if (author && author.id !== albumAuthor?.id) {
                throw new HttpException(`Альбом принадлежит другому исполнителю: ${albumAuthor.title}`, HttpStatus.BAD_REQUEST);
            }

            author = albumAuthor;
        }

        delete data.slug;

        const song = await this.songRepo.save(
            {
                ...data,
                author,
                text: this.prettifyService.normalizeText(data.text),
                chords: this.prettifyService.normalizeText(data.chords),
            },
        );

        await this.saveSongUserRelation(user, song);

        return song;

    }

    private async saveSongUserRelation(user: User, song: Song) {

        if (song.id !== 0 && !song.id) {
            return;
        }

        const userSongs = await this.songRepo
            .createQueryBuilder('song')
            .select('song.id')
            .leftJoin('song.users', 'user')
            .where('user.id = :id', {id: user.id})
            .getMany();

        const ids = new Set((userSongs || []).map(item => item.id));

        ids.add(Number(song.id));

        user.songs = [...ids].map(id => ({id} as Song));

        await this.userRepo.save(user);
    }
}
