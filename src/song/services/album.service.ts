import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { slugify } from 'transliteration';
import { Album } from '../entities/album.entity';
import { Author } from '../entities/author.entity';
import { AlbumDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';
import { AttachmentService } from './attachment.service';

@Injectable()
export class AlbumService {
    private readonly albumRepo: Repository<Album>;
    private readonly authorRepo: Repository<Author>;
    @Inject()
    private readonly attachmentService: AttachmentService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.albumRepo = this.conection.getRepository(Album);
        this.authorRepo = this.conection.getRepository(Author);
    }

    async getBySlugOrId(identificator: string): Promise<AlbumDTO> {
        const id = parseInt(identificator, 10);
        return await this.albumRepo.findOne({
            where: [
                { id: id ? id : null },
                { slug: identificator },
            ],
            relations: ['songs', 'author'],
        });
    }

    async editAlbum(album: AlbumDTO, avatar: Buffer): Promise<AlbumDTO> {
        const oldData = await this.albumRepo.findOne({ id: album.id });
        if (!oldData) {
            throw new HttpException('Ошибка редактирования альбома!', HttpStatus.BAD_REQUEST);
        }

        if (avatar) {
            album.thumbnail = await this.attachmentService
                .saveSquareImageAttachment(
                    avatar,
                    600,
                    oldData.slug,
                    oldData.thumbnail,
                );
        }

        if (!await this.authorRepo.findOne({ id: Number(album.author) || null })) {
            delete album.author;
        }

        delete album.slug;
        await this.albumRepo.update({ id: album.id }, { ...album });
        return await this.getBySlugOrId(String(album.id));
    }

    async addAlbum(album: AlbumDTO, avatar: Buffer): Promise<AlbumDTO> {
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
            .orderBy({ ...this.generateOrderFilter(filter) })
            .getManyAndCount();

        return new Pagination<AlbumDTO>({
            curPage: page,
            countPages: Math.ceil(total / limit),
            total,
            results,
        });
    }

    private generateOrderFilter(filter: string): any {
        const order = {};
        if (filter === 'revert_alphabet') {
            order['album.title'] = 'DESC';
        }

        if (filter === 'alphabet') {
            order['album.title'] = 'ASC';
        }
        if (filter === 'newest') {
            order['album.createdAt'] = 'ASC';
        }

        return order;
    }
}
