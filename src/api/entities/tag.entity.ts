import {Column, Entity, PrimaryGeneratedColumn, ManyToMany, Index, ManyToOne} from 'typeorm';
import { Song } from './song.entity';
import {User} from '../../user/entities';

@Entity('tags')
export class Tag {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToMany(type => Song, song => song.tags, { cascade: false })
    songs: Song[];

    @ManyToOne(type => User)
    owner: User;
}
