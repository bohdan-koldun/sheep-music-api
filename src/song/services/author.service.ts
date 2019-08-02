import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository, Like } from 'typeorm';
import { AuthorDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';
import { Author } from '../entities/author.entity';

@Injectable()
export class AuthorService {
    private readonly authorRepo: Repository<AuthorDTO>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.authorRepo = this.conection.getRepository(Author);
    }

    async getBySlugOrId(identificator: string): Promise<AuthorDTO> {
        const id = parseInt(identificator, 10);
        return await this.authorRepo.findOne({
            where: [
                { id: id ? id : null },
                { slug: identificator },
            ],
            relations: ['songs', 'albums'],
        });
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<AuthorDTO>> {
        const { keyword, limit, page } = options;
        const [results, total] = await this.authorRepo
            .createQueryBuilder('author')
            .leftJoinAndSelect('author.songs', 'songs')
            .loadRelationCountAndMap('author.songs', 'author.songs')
            .leftJoinAndSelect('author.albums', 'albums')
            .loadRelationCountAndMap('author.albums', 'author.albums')
            .leftJoinAndSelect('author.thumbnail', 'thumbnail')
            .skip(page * limit)
            .take(limit)
            .where('author.title like :title', { title: '%' + keyword + '%' })
            .getManyAndCount();

        return new Pagination<AuthorDTO>({
            curPage: page,
            countPages: Math.ceil(total / limit),
            total,
            results,
        });
    }
}
