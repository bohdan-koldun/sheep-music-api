import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserDTO } from '../dto/user.dto';
import { Confirmation } from './confirmation.entity';
import { RoleUser } from './role.user.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 60 })
    password: string;

    passwordConfirmation?: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ name: 'is_email_confirmed' })
    isEmailConfirmed: boolean;

    @Column({ type: 'varchar', length: 50, nullable: true })
    phone: string;

    @Column({ name: 'facebook_id', type: 'varchar', length: 255, nullable: true })
    facebookId: string;

    @Column({ name: 'google_id', type: 'varchar', length: 255, nullable: true })
    googleId: string;

    @OneToOne(type => Confirmation, confirmation => confirmation.user)
    @JoinColumn()
    confirmation: Confirmation;

    @OneToMany(type => RoleUser, roleUser => roleUser.user)
    roles: RoleUser[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async comparePassword(attempt: string): Promise<User> {
        return await bcrypt.compare(attempt, this.password);
    }

    toResponseObject(): UserDTO {
        const {
            id,
            name,
            email,
            phone,
            facebookId,
            googleId,
            roles,
            isEmailConfirmed,
        } = this;

        return {
            id,
            name,
            email,
            phone,
            facebookId,
            googleId,
            roles,
            isEmailConfirmed,
        };
    }
}
