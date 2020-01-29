import { MinLength, IsOptional } from 'class-validator';
import { Album } from '../entities/album.entity';
import { Author } from '../entities/author.entity';
import { Attachment } from '../entities/attachment.entity';
import { Tag } from '../entities/tag.entity';
import {User} from '../../user/entities/user.entity';

export class SongDTO {
    @IsOptional()
    id: number;

    @IsOptional()
    @MinLength(2)
    slug: string;

    @MinLength(2, {message: 'Длина заголовка должна быть 2 и больше символов'})
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
    phonogramMp3: Attachment;

    @IsOptional()
    video: string;

    @IsOptional()
    language: string;

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
    owner?: User;
}
