import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Song } from './song.entity';

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToMany(type => Song, song => song.tags, { cascade: false })
    songs: Song[];
}
