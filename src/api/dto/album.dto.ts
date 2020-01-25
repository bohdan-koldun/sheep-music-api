import {MinLength, IsOptional} from 'class-validator';
import {Author} from '../entities/author.entity';
import {Attachment} from '../entities/attachment.entity';
import {Song} from '../entities/song.entity';
import {User} from '../../user/entities';

export class AlbumDTO {
    @IsOptional()
    id: number;

    @IsOptional()
    @MinLength(2)
    slug: string;

    @MinLength(2, {message: 'Длина заголовка должна быть 2 и больше символов'})
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

    @IsOptional()
    owner?: User;
}
