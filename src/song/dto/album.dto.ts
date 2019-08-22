import { MinLength, IsOptional } from 'class-validator';
import { Author } from '../entities/author.entity';
import { Attachment } from '../entities/attachment.entity';
import { Song } from '../entities/song.entity';

export class AlbumDTO {
    @IsOptional()
    id: number;

    @MinLength(2)
    slug: string;

    @MinLength(2)
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    year: string;

    @IsOptional()
    iTunes: string;

    @IsOptional()
    googlePlay: string;

    @IsOptional()
    parsedSource: string;

    @IsOptional()
    thumbnail: Attachment;

    @IsOptional()
    author: Author;

    @IsOptional()
    songs: Song[];
}