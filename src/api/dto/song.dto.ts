import { MinLength, IsOptional } from 'class-validator';
import { Album } from '../entities/album.entity';
import { Author } from '../entities/author.entity';
import { Attachment } from '../entities/attachment.entity';
import { Tag } from '../entities/tag.entity';

export class SongDTO {
    @IsOptional()
    id: number;

    @IsOptional()
    @MinLength(2)
    slug: string;

    @MinLength(2)
    title: string;

    @IsOptional()
    chords: string;

    @IsOptional()
    text: string;

    @IsOptional()
    chordsKey: string;

    @IsOptional()
    audioMp3: Attachment;

    @IsOptional()
    video: string;

    @IsOptional()
    parsedSource?: string;

    @IsOptional()
    viewCount: number;

    @IsOptional()
    likeCount: number;

    @IsOptional()
    album: Album;

    @IsOptional()
    author: Author;

    @IsOptional()
    tags?: Tag[];

    @IsOptional()
    owner?: Tag[];
}
