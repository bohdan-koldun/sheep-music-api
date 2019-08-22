import { MinLength, IsOptional } from 'class-validator';
import { Author } from '../entities/author.entity';
import { Attachment } from '../entities/attachment.entity';
import { Song } from '../entities/song.entity';
import { Album } from '../entities/album.entity';

export class AuthorDTO {
    @IsOptional()
    id: number;

    @MinLength(2)
    slug: string;

    @MinLength(2)
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    parsedSource: string;

    @IsOptional()
    thumbnail: Attachment;

    @IsOptional()
    songs: Song[];

    @IsOptional()
    albums: Album[];
}