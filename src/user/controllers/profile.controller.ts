import { Controller, Get, UseGuards, Res, HttpStatus, Body, Put } from '@nestjs/common';
import { ValidationPipe } from '../../common/pipes/validation.pipe';
import { Response } from 'express';
import { GetUser } from '../../common/decorators';
import { ProfileService } from '../services';
import { User } from '../entities';
import { UserDTO } from '../dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get()
    async show(@GetUser() authUser: User, @Res() res: Response) {
        const { id } = authUser;
        const user = await this.profileService.getUserInfo(id);

        res.status(HttpStatus.OK).json(user.toResponseObject());
    }

    @Put()
    async update(
        @Body(new ValidationPipe()) data: UserDTO,
        @GetUser() authUser: User,
        @Res() res: Response,
    ) {
        const { id } = authUser;
        const result = await this.profileService.editUserInfo(data, id);
        const { user, confirm } = result;
        res.status(HttpStatus.OK).json({
            user: user.toResponseObject(),
            newEmail: confirm ? confirm.newEmail : null,
            message: confirm ?
                'User data update. Added new email. Please confirm' :
                'User data update',

        });
    }

}
