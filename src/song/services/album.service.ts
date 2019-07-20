import { Injectable, Inject } from '@nestjs/common';
import { Connection, Repository, Like } from 'typeorm';
import { Album } from '../entities/album.entity';
import { AlbumDTO } from '../dto';
import { PaginationOptionsInterface, Pagination } from '../../pagination';

@Injectable()
export class AlbumService {
    private readonly albumRepo: Repository<AlbumDTO>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.albumRepo = this.conection.getRepository(Album);
    }

    async getBySlugOrId(identificator: string): Promise<AlbumDTO> {
        const id = parseInt(identificator, 10);
        return await this.albumRepo.findOne({
            where: [
                { id: id ? id : null },
                { slug: identificator },
            ],
        });
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<AlbumDTO>> {
        const { keyword, limit, page } = options;
        const [results, total] = await this.albumRepo.findAndCount({
            where: { title: Like('%' + keyword + '%') },
            // TODO order: { title: 'DESC' },
            take: limit,
            skip: limit * page ,
        });

        return new Pagination<AlbumDTO>({
            curPage: page,
            total,
            results,
        });
    }
}
