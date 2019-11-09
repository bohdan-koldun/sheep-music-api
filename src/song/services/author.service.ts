import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { slugify } from 'transliteration';
import { AuthorDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';
import { Author } from '../entities/author.entity';
import { AttachmentService } from './attachment.service';

@Injectable()
export class AuthorService {
    private readonly authorRepo: Repository<Author>;
    @Inject()
    private readonly attachmentService: AttachmentService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.authorRepo = this.conection.getRepository(Author);
    }

    async getBySlugOrId(identificator: string): Promise<AuthorDTO> {
        const id = parseInt(identificator, 10);
        return await this.authorRepo
            .createQueryBuilder('author')
            .leftJoinAndSelect('author.songs', 'songs')
            .leftJoinAndSelect('songs.album', 'album')
            .leftJoinAndSelect('songs.audioMp3', 'audioMp3')
            .leftJoinAndSelect('songs.author', 'songAuthor')
            .leftJoinAndSelect('author.albums', 'albums')
            .leftJoinAndSelect('albums.thumbnail', 'albumsThumbnail')
            .loadRelationCountAndMap('albums.songs', 'albums.songs')
            .leftJoinAndSelect('author.thumbnail', 'thumbnail')
            .where('author.slug=:slug', { slug: identificator })
            .orWhere('author.id=:id', { id: id ? id : null })
            .getOne();
    }

    async editAuthor(author: AuthorDTO, avatar: Buffer): Promise<AuthorDTO> {
        const oldData = await this.authorRepo.findOne({ id: author.id });
        if (!oldData) {
            throw new HttpException('Ошибка редактирования автора!', HttpStatus.BAD_REQUEST);
        }

        if (avatar) {
            author.thumbnail = await this.attachmentService
                .saveSquareImageAttachment(
                    avatar,
                    400,
                    oldData.slug,
                    oldData.thumbnail,
                );
        }

        delete author.slug;
        await this.authorRepo.update({ id: author.id }, { ...author });
        return await this.getBySlugOrId(String(author.id));
    }

    async addAuthor(author: AuthorDTO, avatar: Buffer): Promise<AuthorDTO> {
        const slug = slugify(author.title);

        if (avatar) {
            author.thumbnail = await this.attachmentService
                .saveSquareImageAttachment(
                    avatar,
                    600,
                    slug,
                );
        }
        let newAuthor;
        try {
            newAuthor = await this.authorRepo.save({ ...author, slug });
        } catch (error) {
            newAuthor =  await this.authorRepo.save({
                ...author,
                slug: `${slugify(author.title)}${Date.now()}`,
            });
        }

        return await this.getBySlugOrId(String(newAuthor.id));
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<AuthorDTO>> {
        const { keyword, limit, page, filter } = options;
        Logger.log(JSON.stringify(options, null, 2));
        const [results, total] = await this.authorRepo
            .createQueryBuilder('author')
            .leftJoinAndSelect('author.songs', 'songs')
            .loadRelationCountAndMap('author.songs', 'author.songs')
            .leftJoinAndSelect('author.albums', 'albums')
            .loadRelationCountAndMap('author.albums', 'author.albums')
            .leftJoinAndSelect('author.thumbnail', 'thumbnail')
            .skip(page * limit)
            .take(limit)
            .where('LOWER(author.title) like :title', { title: '%' + keyword.toLowerCase() + '%' })
            .orderBy({ ...this.generateOrderFilter(filter) })
            .getManyAndCount();

        return new Pagination<AuthorDTO>({
            curPage: page,
            countPages: Math.ceil(total / limit),
            total,
            results,
        });
    }

    async getIdTitleList() {
        return await this.authorRepo.find({select: ['id', 'title']});
    }

    private generateOrderFilter(filter: string): any {
        const order = {};
        if (filter === 'revert_alphabet') {
            order['author.title'] = 'DESC';
        }

        if (filter === 'alphabet') {
            order['author.title'] = 'ASC';
        }
        if (filter === 'newest') {
            order['author.createdAt'] = 'ASC';
        }

        return order;
    }
}
