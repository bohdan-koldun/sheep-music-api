import {Column, Entity, PrimaryGeneratedColumn, Index, ManyToOne} from 'typeorm';
import {User} from '../../user/entities';

@Entity('attachments')
export class Attachment {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 500 })
    path: string;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    awsKey: string;

    @Column({ type: 'real', nullable: true })
    duration: number;

    @ManyToOne(type => User)
    owner: User;
}
