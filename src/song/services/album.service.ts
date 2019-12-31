import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { slugify } from 'transliteration';
import { Album } from '../entities/album.entity';
import { Author } from '../entities/author.entity';
import { AlbumDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';
import { AttachmentService } from './attachment.service';
import { User } from '../../user/entities';

@Injectable()
export class AlbumService {
    private readonly albumRepo: Repository<Album>;
    private readonly authorRepo: Repository<Author>;
    private readonly userRepo: Repository<User>;
    @Inject()
    private readonly attachmentService: AttachmentService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.albumRepo = this.conection.getRepository(Album);
        this.authorRepo = this.conection.getRepository(Author);
        this.userRepo = this.conection.getRepository(User);
    }

    async getBySlugOrId(identificator: string): Promise<AlbumDTO> {
        const id = !isNaN(Number(identificator)) ? parseInt(identificator, 10) : -1;
        return await this.albumRepo.findOne({
            where: [
                { id: id ? id : null },
                { slug: identificator },
            ],
            relations: ['songs', 'author'],
        });
    }

    async editAlbum(album: AlbumDTO, avatar: Buffer, user: User): Promise<AlbumDTO> {
        const oldData = await this.albumRepo.findOne({ id: album.id });
        if (!oldData) {
            throw new HttpException('Ошибка редактирования альбома!', HttpStatus.BAD_REQUEST);
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

        if (!await this.authorRepo.findOne({ id: Number(album.author) || null })) {
            delete album.author;
        }

        delete album.slug;
        await this.albumRepo.update({ id: album.id }, { ...album });

        await this.saveAlbumUserRelation(user, album as Album);

        return await this.getBySlugOrId(String(album.id));
    }

    async addAlbum(album: AlbumDTO, avatar: Buffer, user: User): Promise<AlbumDTO> {
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
            newAlbum = await this.albumRepo.save({ ...album, slug });
        } catch (error) {
            newAlbum = await this.albumRepo.save({
                ...album,
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
            .leftJoinAndSelect('album.songs', 'songs')
            .loadRelationCountAndMap('album.songs', 'album.songs')
            .leftJoinAndSelect('album.thumbnail', 'thumbnail')
            .skip(page * limit)
            .take(limit)
            .where('LOWER(album.title) like :title', { title: '%' + keyword.toLowerCase() + '%' })
            .orderBy({ ...AlbumService.generateOrderFilter(filter) })
            .getManyAndCount();

        return new Pagination<AlbumDTO>({
            curPage: page,
            countPages: Math.ceil(total / limit),
            total,
            results,
        });
    }

    async getIdTitleList() {
        return await this.albumRepo.find({ select: ['id', 'title'] });
    }

    static generateOrderFilter(filter: string): any {
        switch (filter) {
            case 'revert_alphabet':
                return { 'album.title': 'DESC' };
            case 'alphabet':
                return { 'album.title': 'ASC' };
            case 'newest':
                return { 'album.createdAt': 'ASC' };
            case 'popular':
                return { 'album.viewCount': 'DESC' };
            case 'favorite':
                return { 'album.favorite': 'DESC' };
            default:
                return { 'album.createdAt': 'ASC' };
        }
    }

    async incrementView(id: number) {
        await this.albumRepo
            .increment({ id }, 'viewCount', 1);
    }

    async incrementLike(id: number) {
        await this.albumRepo
            .increment({ id }, 'likeCount', 1);
    }

    private async saveAlbumUserRelation(user: User, album: Album) {

        if (album.id !== 0 && !album.id) { return; }

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
