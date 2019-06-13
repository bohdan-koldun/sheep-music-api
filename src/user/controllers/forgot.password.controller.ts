import { Controller, Post, Body, Res, HttpStatus, Inject } from '@nestjs/common';
import { Response } from 'express';
import { ForgotPasswordService } from '../services';
import { AuthService } from '../../auth/auth.service';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { EmailDTO, ConfirmDTO } from '../dto';

@Controller('password')
export class ForgotPasswordController {
    @Inject()
    private readonly forgotPassService: ForgotPasswordService;
    @Inject()
    private readonly authService: AuthService;

    @Post('restore')
    async restorePassword(@Body(new ValidationPipe()) data: EmailDTO, @Res() res: Response) {
        const message = await this.forgotPassService.restorePassword(data);
        res.status(HttpStatus.OK).json({message});
    }

    @Post('reset')
    async resetPassword(@Body(new ValidationPipe()) confirm: ConfirmDTO, @Res() res: Response) {
        const user = await this.forgotPassService.resetPassword(confirm);
        const token = this.authService.createToken(user.email);
        res.status(HttpStatus.OK).json({
            token,
            user: user.toResponseObject(),
            message: 'New password reset successful',

        });
    }
}
