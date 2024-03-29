import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { slugify } from 'transliteration';
import { Album } from '../../entities/album.entity';
import { AlbumViewLog } from '../../entities/album.view.log.entity';
import { Author } from '../../entities/author.entity';
import { AlbumDTO } from '../../dto';
import { PaginationOptionsInterface, Pagination } from '../../../pagination';
import { AttachmentService } from '../attachment/attachment.service';
import { User } from '../../../user/entities';
import { generateOrderFilter } from '../../../common/filters/typeorm.order.filter';

@Injectable()
export class AlbumService {
    private readonly albumRepo: Repository<Album>;
    private readonly authorRepo: Repository<Author>;
    private readonly userRepo: Repository<User>;
    private readonly albumViewLogRepo: Repository<AlbumViewLog>;

    @Inject()
    private readonly attachmentService: AttachmentService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.albumRepo = this.conection.getRepository(Album);
        this.authorRepo = this.conection.getRepository(Author);
        this.userRepo = this.conection.getRepository(User);
        this.albumViewLogRepo = this.conection.getRepository(AlbumViewLog);
    }

    async getBySlugOrId(identificator: string): Promise<Album> {
        const id = !isNaN(Number(identificator)) ? parseInt(identificator, 10) : -1;

        return this.albumRepo
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.author', 'author')
            .leftJoinAndSelect('album.songs', 'songs')
            .leftJoinAndSelect('songs.audioMp3', 'audioMp3')
            .leftJoinAndSelect('album.thumbnail', 'thumbnail')
            .leftJoinAndSelect('author.thumbnail', 'authorThumbnail')
            .where('album.slug=:slug or album.id=:id', { id, slug: identificator })
            .select([
                'album.id', 'album.slug', 'album.title', 'album.year',
                'album.createdAt', 'album.viewCount', 'album.likeCount', 'album.deezer',
                'album.iTunes', 'album.googlePlay', 'album.soundCloud', 'album.youtubeMusic',
                'author.id', 'author.title',
                'thumbnail.id', 'thumbnail.path',
                'authorThumbnail.id', 'authorThumbnail.path',
                'songs.id', 'songs.slug', 'songs.title', 'songs.video',
                'songs.audioMp3', 'audioMp3.id', 'audioMp3.path', 'audioMp3.duration',
            ])
            .getOne();
    }

    async editAlbum(album: AlbumDTO, avatar: Buffer, user: User): Promise<Album> {
        const oldData = await this.albumRepo.findOne({ where: { id: album.id }, relations: ['songs'] });

        if (!oldData) {
            throw new HttpException('Ошибка редактирования альбома!', HttpStatus.BAD_REQUEST);
        }

        const { author } = album as any;

        if (author && Number.isInteger(Number(author))) {
            if (oldData.songs ?.length && oldData.author ?.id !== Number(author)) {
                throw new HttpException(
                    `Нельзя изменить исполнителя, альбом уже имеет песни: ${oldData.songs.map(item => item.title).join(', ')}`,
                    HttpStatus.BAD_REQUEST,
                );
            }

        } else {
            delete album.author;
        }

        if (avatar) {
            album.thumbnail = await this.attachmentService
                .saveSquareImageAttachment(
                    avatar,
                    400,
                    oldData.slug,
                    oldData.thumbnail,
                );
        }

        delete album.slug;

        await this.albumRepo.update({ id: album.id }, {
            ...album,
        });

        await this.saveAlbumUserRelation(user, album as unknown as Album);

        return await this.getBySlugOrId(String(album.id));
    }

    async addAlbum(album: AlbumDTO, avatar: Buffer, user: User): Promise<Album> {
        const slug = slugify(album.title);

        if (avatar) {
            album.thumbnail = await this.attachmentService
                .saveSquareImageAttachment(
                    avatar,
                    600,
                    slug,
                );
        }

        if (!await this.authorRepo.findOne({ id: Number(album.author) || null })) {
            delete album.author;
        }

        let newAlbum;
        try {
            newAlbum = await this.albumRepo.save({ ...album, owner: user, slug });
        } catch (error) {
            newAlbum = await this.albumRepo.save({
                ...album,
                owner: user,
                slug: `${slugify(album.title)}${Date.now()}`,
            });
        }

        await this.saveAlbumUserRelation(user, newAlbum);

        return await this.getBySlugOrId(String(newAlbum.id));
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<AlbumDTO>> {
        const { keyword, limit, page, filter } = options;

        const [results, total] = await this.albumRepo
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.author', 'author')
            .loadRelationCountAndMap('album.songs', 'album.songs')
            .leftJoinAndSelect('album.thumbnail', 'thumbnail')
            .skip(page * limit)
            .take(limit)
            .where('LOWER(album.title) like :title', { title: '%' + keyword.toLowerCase() + '%' })
            .select([
                'album.id', 'album.slug', 'album.title', 'album.year',
                'album.createdAt', 'album.viewCount', 'album.likeCount',
                'author.id', 'author.title',
                'thumbnail.id', 'thumbnail.path',
            ])
            .orderBy({ ...generateOrderFilter(filter, 'album') })
            .getManyAndCount();

        return new Pagination<any>({
            curPage: Number(page),
            countPages: Math.ceil(total / limit),
            total,
            results,
        });
    }

    async getIdTitleList(authorId) {
        const query = this.albumRepo.createQueryBuilder('album');

        if (!isNaN(parseInt(authorId, 10))) {
            query.leftJoinAndSelect('album.author', 'author')
                .where('author.id=:authorId', { authorId });
        }

        return await query.select(['album.id', 'album.title']).getMany();
    }

    async incrementView(id: number) {
        const album = { id };

        await this.albumRepo.increment(album, 'viewCount', 1);

        const date = new Date(new Date(Date.now()).toLocaleString().split(',')[0]);

        const { id: albumId } = (
            await this.albumViewLogRepo.findOne({ date, album }) ||
            await this.albumViewLogRepo.save({ date, album })
        );

        await this.albumViewLogRepo.increment({ id: albumId }, 'count', 1);
    }

    async incrementLike(id: number) {
        await this.albumRepo
            .increment({ id }, 'likeCount', 1);
    }

    private async saveAlbumUserRelation(user: User, album: Album) {

        if (album.id !== 0 && !album.id) {
            return;
        }

        const userAlbums = await this.albumRepo
            .createQueryBuilder('album')
            .select('album.id')
            .leftJoin('album.users', 'user')
            .where('user.id = :id', { id: user.id })
            .getMany();

        const ids = new Set((userAlbums || []).map(item => item.id));

        ids.add(Number(album.id));

        user.albums = [...ids].map(id => ({ id } as Album));

        await this.userRepo.save(user);
    }
}
