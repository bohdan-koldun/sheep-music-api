import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Song } from './song.entity';

@Entity('translations')
export class Translation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 20 })
    language: string;

    @ManyToOne(type => Song, { cascade: false,  eager: true })
    @JoinColumn()
    song: Song;

    @ManyToMany(type => Song, song => song.translations, { cascade: false })
    songs: Song[];

}
