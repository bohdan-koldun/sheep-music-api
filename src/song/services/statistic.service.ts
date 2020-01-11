import {Injectable, Inject} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {Song} from '../entities/song.entity';
import {Album} from '../entities/album.entity';
import {Author} from '../entities/author.entity';
import {AlbumService} from './album.service';
import {AuthorService} from './author.service';
import {generateOrderFilter} from '../../utils/filter';

@Injectable()
export class StatisticService {
    private readonly songRepo: Repository<Song>;
    private readonly albumRepo: Repository<Album>;
    private readonly authorRepo: Repository<Author>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.songRepo = this.conection.getRepository(Song);
        this.albumRepo = this.conection.getRepository(Album);
        this.authorRepo = this.conection.getRepository(Author);
    }

    async getTopLists(count: number, filter: string) {
        const songs = await this.songRepo
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.audioMp3', 'audioMp3')
            .leftJoinAndSelect('song.author', 'author')
            .leftJoinAndSelect('author.thumbnail', 'authorThumbnail')
            .leftJoinAndSelect('song.album', 'album')
            .leftJoinAndSelect('song.tags', 'tags')
            .leftJoinAndSelect('album.thumbnail', 'albumThumbnail')
            .orderBy({...generateOrderFilter(filter, 'song')})
            .take(count)
            .getMany();

        const albums = await this.albumRepo
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('album.songs', 'songs')
            .loadRelationCountAndMap('album.songs', 'album.songs')
            .leftJoinAndSelect('album.thumbnail', 'thumbnail')
            .take(count)
            .orderBy({...generateOrderFilter(filter, 'album')})
            .getMany();

        const authors = await this.authorRepo
            .createQueryBuilder('author')
            .leftJoinAndSelect('author.songs', 'songs')
            .loadRelationCountAndMap('author.songs', 'author.songs')
            .leftJoinAndSelect('author.albums', 'albums')
            .loadRelationCountAndMap('author.albums', 'author.albums')
            .leftJoinAndSelect('author.thumbnail', 'thumbnail')
            .take(count)
            .orderBy({...generateOrderFilter(filter, 'author')})
            .getMany();

        return {
            songs,
            albums,
            authors,
        };
    }

}
