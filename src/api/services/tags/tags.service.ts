import { Injectable, Inject, Logger } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { slugify } from 'transliteration';
import { Song } from '../../entities/song.entity';
import { Tag } from '../../entities/tag.entity';
import { TagDTO } from '../../dto';

@Injectable()
export class TagsService {
    private readonly songRepo: Repository<Song>;
    private readonly tagRepo: Repository<Tag>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.songRepo = this.conection.getRepository(Song);
        this.tagRepo = this.conection.getRepository(Tag);
    }

    async getSongTags(): Promise<Tag[]> {
        return await this.tagRepo
            .createQueryBuilder('tags')
            .loadRelationCountAndMap('tags.songsCount', 'tags.songs')
            .getMany();
    }
}
