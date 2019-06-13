import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { RoleUser } from './role.user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    description: string;

    @OneToMany(type => RoleUser, roleUser => roleUser.role)
    rolesUser: RoleUser[];
}
