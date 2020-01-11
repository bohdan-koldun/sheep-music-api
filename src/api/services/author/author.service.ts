import { Injectable, Inject, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { slugify } from 'transliteration';
import { AuthorDTO } from '../../dto';
import { PaginationOptionsInterface, Pagination } from '../../../pagination';
import { Author } from '../../entities/author.entity';
import { AttachmentService } from '../attachment/attachment.service';
import { User } from '../../../user/entities';
import {generateOrderFilter} from '../../../utils/filter';

@Injectable()
export class AuthorService {
    private readonly authorRepo: Repository<Author>;
    private readonly userRepo: Repository<User>;
    @Inject()
    private readonly attachmentService: AttachmentService;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.authorRepo = this.conection.getRepository(Author);
        this.userRepo = this.conection.getRepository(User);
    }

    async getBySlugOrId(identificator: string): Promise<AuthorDTO> {
        const id = !isNaN(Number(identificator)) ? parseInt(identificator, 10) : -1;

        return await this.authorRepo
            .createQueryBuilder('author')
            .leftJoinAndSelect('author.songs', 'songs')
            .leftJoinAndSelect('songs.album', 'album')
            .leftJoinAndSelect('songs.audioMp3', 'audioMp3')
            .leftJoinAndSelect('songs.author', 'songAuthor')
            .leftJoinAndSelect('songAuthor.thumbnail', 'authorThumbnail')
            .leftJoinAndSelect('author.albums', 'albums')
            .leftJoinAndSelect('albums.thumbnail', 'albumsThumbnail')
            .loadRelationCountAndMap('albums.songs', 'albums.songs')
            .leftJoinAndSelect('author.thumbnail', 'thumbnail')
            .where('author.slug=:slug', { slug: `${identificator}` })
            .orWhere('author.id=:id', { id })
            .getOne();
    }

    async editAuthor(author: AuthorDTO, avatar: Buffer, user: User): Promise<AuthorDTO> {
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

        await this.saveAuthorUserRelation(user, author as Author);

        return await this.getBySlugOrId(String(author.id));
    }

    async addAuthor(author: AuthorDTO, avatar: Buffer, user: User): Promise<AuthorDTO> {
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
            newAuthor = await this.authorRepo.save({ ...author, owner: user, slug });
        } catch (error) {
            newAuthor = await this.authorRepo.save({
                ...author,
                owner: user,
                slug: `${slugify(author.title)}${Date.now()}`,
            });
        }

        await this.saveAuthorUserRelation(user, newAuthor);

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
            .orderBy({ ...generateOrderFilter(filter, 'author') })
            .getManyAndCount();

        return new Pagination<AuthorDTO>({
            curPage: page,
            countPages: Math.ceil(total / limit),
            total,
            results,
        });
    }

    async getIdTitleList() {
        return await this.authorRepo.find({ select: ['id', 'title'] });
    }

    async incrementView(id: number) {
        await this.authorRepo
            .increment({ id }, 'viewCount', 1);
    }

    async incrementLike(id: number) {
        await this.authorRepo
            .increment({ id }, 'likeCount', 1);
    }

    private async saveAuthorUserRelation(user: User, author: Author) {

        if (author.id !== 0 && !author.id) { return; }

        const userAuthors = await this.authorRepo
            .createQueryBuilder('author')
            .select('author.id')
            .leftJoin('author.users', 'user')
            .where('user.id = :id', { id: user.id })
            .getMany();

        const ids = new Set((userAuthors || []).map(item => item.id));

        ids.add(Number(author.id));

        user.authors = [...ids].map(id => ({ id } as Author));

        await this.userRepo.save(user);
    }
}
