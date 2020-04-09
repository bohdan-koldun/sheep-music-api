import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Song } from '../../entities/song.entity';
import { Album } from '../../entities/album.entity';
import { Author } from '../../entities/author.entity';
import { SongViewLog } from '../../entities/song.view.log.entity';
import { AlbumViewLog } from '../../entities/album.view.log.entity';
import { generateOrderFilter } from '../../../common/filters/typeorm.order.filter';
import { User } from '../../../user/entities/user.entity';

@Injectable()
export class StatisticService {
    private readonly songRepo: Repository<Song>;
    private readonly albumRepo: Repository<Album>;
    private readonly authorRepo: Repository<Author>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly connection: Connection,
    ) {
        this.songRepo = this.connection.getRepository(Song);
        this.albumRepo = this.connection.getRepository(Album);
        this.authorRepo = this.connection.getRepository(Author);
    }

    async getTopLists(count: number, filter: string) {
        const songs = this.songRepo
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.audioMp3', 'audioMp3')
            .leftJoinAndSelect('song.author', 'author')
            .leftJoinAndSelect('author.thumbnail', 'authorThumbnail')
            .leftJoinAndSelect('song.album', 'album')
            .leftJoinAndSelect('song.tags', 'tags')
            .leftJoinAndSelect('album.thumbnail', 'albumThumbnail')
            .orderBy({ ...generateOrderFilter(filter, 'song') })
            .take(count)
            .getMany();

        const topAlbums = this.connection.getRepository(AlbumViewLog)
            .createQueryBuilder('viewlog')
            .select('viewlog."albumId"')
            .where(`viewlog."created_at" > now() - interval '30 days'`)
            .groupBy('viewlog."albumId"')
            .orderBy({ 'SUM(viewlog.count)': 'DESC' })
            .take(count);

        const albums = this.albumRepo
            .createQueryBuilder('album')
            .leftJoinAndMapOne('album.author', 'album.author', 'author')
            .leftJoinAndMapOne('album.thumbnail', 'album.thumbnail', 'thumbnail')
            .loadRelationCountAndMap('album.songs', 'album.songs')
            .select([
                'album.id', 'album.slug', 'album.title', 'album.viewCount',
                'album.year', 'album.createdAt', 'album.likeCount',
                'author.id', 'author.title',
                'thumbnail.id', 'thumbnail.path',
            ])
            .where('album.id IN (' + topAlbums.getQuery() + ')')
            .getMany();

        const authors = this.authorRepo
            .createQueryBuilder('author')
            .leftJoinAndSelect('author.songs', 'songs')
            .loadRelationCountAndMap('author.songs', 'author.songs')
            .leftJoinAndSelect('author.albums', 'albums')
            .loadRelationCountAndMap('author.albums', 'author.albums')
            .leftJoinAndSelect('author.thumbnail', 'thumbnail')
            .take(count)
            .orderBy({ ...generateOrderFilter(filter, 'author') })
            .getMany();

        const results = await Promise.all([
            songs,
            albums,
            authors,
        ]);

        return {
            songs: results[0],
            albums: results[1],
            authors: results[2],
        };
    }

    async getModeratorStatistic(user: User): Promise<object> {
        const added = entity => this.connection.manager.query(
            `select u.id, u.name, count(*), sum(e."viewCount") as sumView, sum(e."likeCount") as sumLike ` +
            `from users as u ` +
            `inner join ${entity} as e on u.id=e."ownerId" group by u.id`,
        );

        const edited = entity => this.connection.manager.query(
            `select u.id, u.name, count(*), sum(e."viewCount") as sumView, sum(e."likeCount") from users` +
            ` as u left join users_${entity}_${entity} as ue on u.id = ue."usersId"` +
            ` inner join ${entity} as e on ue."${entity}Id" = e.id group by u.id`,
        );

        const statisticPromises = {
            songs: added('songs'),
            albums: added('albums'),
            authors: added('authors'),
            editedSongs: edited('songs'),
            editedAlbums: edited('albums'),
            editedAuthors: edited('authors'),
        };

        const result = await Promise.all(Object.values(statisticPromises));

        return Object.keys(statisticPromises).reduce((obj, key, i) => ({
            ...obj,
            [key]: result[i],
        }), {});
    }

}
