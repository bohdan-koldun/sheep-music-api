import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import * as moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities';
import { LoginDTO } from './login.dto';

@Injectable()
export class AuthService {
    @Inject('DATABASE_CONNECTION')
    private readonly conection: Connection;
    @Inject()
    private readonly jwtService: JwtService;

    async login(data: LoginDTO) {
        const { email, password } = data;
        const user = await this.conection
            .getRepository(User)
            .findOne({ where: {email}, relations: ['roles', 'roles.role'] });
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(
                'Invalid username/password',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!user.isEmailConfirmed) {
            throw new HttpException(
                'Email is not confirmed',
                HttpStatus.BAD_REQUEST,
            );
        }
        const token = this.createToken(email);

        return {
            token,
            user: user.toResponseObject(),
            message: 'Login successful',
        };
    }

    createToken(email: string) {
        const accessToken = this.jwtService.sign({ email });
        const decodedToken: any = this.jwtService.decode(accessToken);

        return {
            expiresIn: (
                decodedToken && decodedToken.exp ?
                    `${moment(decodedToken.exp * 1000).diff(moment(), 'day') + 1} day` :
                    'no expire'
            ),
            accessToken,
        };
    }

    async validateUser(data: LoginDTO): Promise<any> {
        const { email } = data;
        const user = this.conection
            .getRepository(User)
            .findOne({ email });
        return user;
    }
}
