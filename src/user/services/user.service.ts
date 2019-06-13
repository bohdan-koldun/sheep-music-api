import { Injectable, Inject } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from '../entities';
import { UserDTO } from '../dto';

@Injectable()
export class UserService {
    @Inject('DATABASE_CONNECTION')
    private readonly conection: Connection;

    async getUserList(): Promise<UserDTO[]> {
        const users = await this.conection
            .getRepository(User)
            .find({ relations: ['roles', 'roles.role'] });

        return users.map(user => user.toResponseObject()) as unknown as UserDTO[];
    }
}
