import { Column, Entity, PrimaryGeneratedColumn, Index, ManyToOne, CreateDateColumn } from 'typeorm';
import { Song } from './song.entity';

@Entity('song_view_log')
export class SongViewLog {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'int', default: 0 })
    count: number;

    @ManyToOne(type => Song)
    song: Song;

    @Index()
    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt: Date;
}
