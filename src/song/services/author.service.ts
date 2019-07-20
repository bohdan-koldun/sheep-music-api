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
        });
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<AuthorDTO>> {
        const { keyword, limit, page } = options;
        const [results, total] = await this.authorRepo.findAndCount({
            where: { title: Like('%' + keyword + '%') },
            // TODO order: { title: 'DESC' },
            take: limit,
            skip: limit * page ,
        });

        return new Pagination<AuthorDTO>({
            curPage: page,
            countPages: Math.ceil(total / limit),
            total,
            results,
        });
    }
}
