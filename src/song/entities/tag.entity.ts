import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, Index } from 'typeorm';
import { Song } from './song.entity';

@Entity('tags')
export class Tag {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'int', default: 0 })
    songCount: number;

    @ManyToMany(type => Song, song => song.tags, { cascade: false })
    songs: Song[];
}
