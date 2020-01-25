import { MinLength, IsOptional } from 'class-validator';
import { Attachment } from '../entities/attachment.entity';
import { Song } from '../entities/song.entity';
import { Album } from '../entities/album.entity';
import {User} from '../../user/entities';

export class AuthorDTO {
    @IsOptional()
    id: number;

    @MinLength(2)
    @IsOptional()
    slug: string;

    @MinLength(2, {message: 'Длина заголовка должна быть 2 и больше символов'})
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

    @IsOptional()
    owner?: User;
}
