import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('role_user')
export class RoleUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Role, role => role.rolesUser)
    role: Role;

    @ManyToOne(type => User, user => user.roles)
    user: User;
}
