import { Controller, Res, HttpStatus, Inject, Get, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserService } from '../services';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    @Inject()
    private readonly userService: UserService;

    @Get('users')
    @UseGuards(RolesGuard)
    @Roles('admin')
    async userList(@Res() res: Response) {
        const users = await this.userService.getUserList();
        res.status(HttpStatus.CREATED).json({
            total: users.length,
            data: users,
        });
    }
}
