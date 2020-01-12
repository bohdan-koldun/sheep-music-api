import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToMany, ManyToOne, Index } from 'typeorm';
import { Song } from './song.entity';
import {User} from '../../user/entities';

@Entity('translations')
export class Translation {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'varchar', length: 20 })
    language: string;

    @ManyToOne(type => Song, { cascade: false,  eager: true })
    @JoinColumn()
    song: Song;

    @ManyToMany(type => Song, song => song.translations, { cascade: false })
    songs: Song[];

    @ManyToOne(type => User)
    owner: User;
}
