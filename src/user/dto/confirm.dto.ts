import { IsEmail, MinLength, IsOptional, MaxLength } from 'class-validator';

export class ConfirmDTO {
    @MinLength(30, { message: 'confirm code is too short' })
    code: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @MinLength(8, { message: 'password is too short' })
    @MaxLength(60, { message: 'password is too long' })
    password: string;

    @IsOptional()
    passwordConfirmation: string;
}
