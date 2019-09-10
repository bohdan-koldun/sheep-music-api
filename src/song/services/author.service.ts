import { Injectable, Inject, Logger } from '@nestjs/common';
import { Connection, Repository, Like } from 'typeorm';
import { AuthorDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';
import { Author } from '../entities/author.entity';

@Injectable()
export class AuthorService {
    private readonly authorRepo: Repository<Author>;

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
