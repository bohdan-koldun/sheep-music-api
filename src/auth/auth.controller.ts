import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { LoginDTO } from './login.dto';

@Controller('login')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post()
    async login(@Body(new ValidationPipe()) data: LoginDTO,  @Res() res: Response) {
        const result =  await this.authService.login(data);
        res.status(HttpStatus.OK).json(result);
    }

}
