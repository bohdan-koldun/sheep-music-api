import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { Song } from '../../entities/song.entity';
import { Album } from '../../entities/album.entity';
import { Author } from '../../entities/author.entity';
import { AuthorViewLog } from '../../entities/author.view.log.entity';
import { AlbumViewLog } from '../../entities/album.view.log.entity';
import { SongViewLog } from '../../entities/song.view.log.entity';
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

    async getTopLists(count: number, days: number) {
        const results = await Promise.all([
            this.getTopSongs(count, days),
            this.getTopAlbums(count, days),
            this.getTopAuthors(count, days),
        ]);

        return {
            songs: results[0],
            albums: results[1],
            authors: results[2],
        };
    }

    async getTopSongs(count: number, days: number) {
        const topSongs = this.connection.getRepository(SongViewLog)
            .createQueryBuilder('viewlog')
            .select('viewlog."songId"')
            .where(`viewlog."created_at" > now() - interval '${days} days'`)
            .groupBy('viewlog."songId"')
            .orderBy({ 'SUM(viewlog.count)': 'DESC' })
            .take(count);

        return this.songRepo
            .createQueryBuilder('song')
            .leftJoinAndMapOne('song.audioMp3', 'song.audioMp3', 'audioMp3')
            .leftJoinAndMapOne('song.author', 'song.author', 'author')
            .leftJoinAndMapOne('author.thumbnail', 'author.thumbnail', 'authorThumbnail')
            .leftJoinAndMapOne('song.album', 'song.album', 'album')
            .leftJoinAndMapOne('album.thumbnail', 'album.thumbnail', 'albumThumbnail')
            .select([
                'song.id', 'song.slug', 'song.title', 'song.viewCount',
                'album.id', 'album.title',
                'albumThumbnail.id', 'albumThumbnail.path',
                'author.id', 'author.title',
                'authorThumbnail.id', 'authorThumbnail.path',
                'audioMp3.id', 'audioMp3.path', 'audioMp3.duration',
            ])
            .where('song.id IN (' + topSongs.getQuery() + ')')
            .getMany();
    }

    async getTopAlbums(count: number, days: number) {
        const topAlbums = this.connection.getRepository(AlbumViewLog)
            .createQueryBuilder('viewlog')
            .select('viewlog."albumId"')
            .where(`viewlog."created_at" > now() - interval '${days} days'`)
            .groupBy('viewlog."albumId"')
            .orderBy({ 'SUM(viewlog.count)': 'DESC' })
            .take(count);

        return this.albumRepo
            .createQueryBuilder('album')
            .leftJoinAndMapOne('album.author', 'album.author', 'author')
            .leftJoinAndMapOne('album.thumbnail', 'album.thumbnail', 'thumbnail')
            .loadRelationCountAndMap('album.songs', 'album.songs')
            .select([
                'album.id', 'album.slug', 'album.title', 'album.viewCount',
                'album.year', 'album.createdAt',
                'author.id', 'author.title',
                'thumbnail.id', 'thumbnail.path',
            ])
            .where('album.id IN (' + topAlbums.getQuery() + ')')
            .getMany();
    }

    async getTopAuthors(count: number, days: number) {
        const topAuthors = this.connection.getRepository(AuthorViewLog)
        .createQueryBuilder('viewlog')
        .select('viewlog."authorId"')
        .where(`viewlog."created_at" > now() - interval '${days} days'`)
        .groupBy('viewlog."authorId"')
        .orderBy({ 'SUM(viewlog.count)': 'DESC' })
        .take(count);

        return this.authorRepo
        .createQueryBuilder('author')
        .loadRelationCountAndMap('author.songs', 'author.songs')
        .loadRelationCountAndMap('author.albums', 'author.albums')
        .leftJoinAndMapOne('author.thumbnail', 'author.thumbnail', 'thumbnail')
        .select([
            'author.id', 'author.slug', 'author.title', 'author.viewCount',
            'author.createdAt', 'thumbnail.id', 'thumbnail.path',
        ])
        .where('author.id IN (' + topAuthors.getQuery() + ')')
        .getMany();
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
