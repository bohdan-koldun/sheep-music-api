import { IsEmail, IsOptional, Matches } from 'class-validator';
import { RoleUser } from '../entities';
import { Song } from '../../api/entities/song.entity';
import { Author } from '../../api/entities/author.entity';
import { Album } from '../../api/entities/album.entity';

export class UserDTO {
    id?: number;
    name: string;
    @IsEmail()
    @IsOptional()
    email: string;
    @IsOptional()
    @Matches(/^[0-9]*$/, 'g', { message: 'phone must be numeric' })
    phone: string;
    isEmailConfirmed?: boolean;
    roles?: RoleUser[];
    password?: string;
    passwordConfirmation?: string;
    facebookId?: string;
    googleId?: string;
    songs?: Song[];
    authors?: Author[];
    albums?: Album[];
}
