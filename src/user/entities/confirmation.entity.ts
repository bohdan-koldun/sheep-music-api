
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('confirmations')
export class Confirmation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'email_code', type: 'varchar', length: 255, nullable: true })
    emailCode: string;

    @Column({ name: 'password_code', type: 'varchar', length: 255, nullable: true })
    passwordCode: string;

    @Column({ name: 'new_email', type: 'varchar', length: 255, nullable: true })
    newEmail: string;

    @OneToOne(type => User, user => user.confirmation)
    @JoinColumn()
    user: User;

    static genarateTokenCode(): string {
        return (
            [...Array(32)].
                map(i => (~~(Math.random() * 36)).
                    toString(36)).join('')
        );
    }
}
