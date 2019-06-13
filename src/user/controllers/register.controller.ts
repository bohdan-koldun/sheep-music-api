import { Controller, Post, Body, Res, HttpStatus, Inject } from '@nestjs/common';
import { Response } from 'express';
import { RegisterService } from '../services';
import { AuthService } from '../../auth/auth.service';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { ConfirmDTO, EmailDTO, UserDTO } from '../dto';

@Controller('register')
export class RegisterController {
    @Inject()
    private readonly registerService: RegisterService;
    @Inject()
    private readonly authService: AuthService;

    @Post()
    async register(
        @Body(new ValidationPipe()) data: UserDTO,
        @Res() res: Response,
    ) {
        const user = await this.registerService.createUser(data);
        res.status(HttpStatus.CREATED).json({
            user,
            message: 'New user register successful. Confirm email',
        });
    }

    @Post('confirm')
    async сonfirm(@Body(new ValidationPipe()) confirm: ConfirmDTO, @Res() res: Response) {
        const user = await this.registerService.registerConfirm(confirm);
        const token = this.authService.createToken(user.email);

        res.status(HttpStatus.OK).json({
            token,
            user,
            message: 'Email has verified successfully',
        });
    }

    @Post('email')
    async resendEmail(@Body(new ValidationPipe()) data: EmailDTO, @Res() res: Response) {
        const message = await this.registerService.resendConfirmMessage(data.email);
        res.status(HttpStatus.OK).json({ message });
    }
}
