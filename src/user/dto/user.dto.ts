import { IsEmail, IsOptional, Matches } from 'class-validator';
import { RoleUser } from '../entities';

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
}
