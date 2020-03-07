import { Column, Entity, PrimaryGeneratedColumn, Index, ManyToOne, CreateDateColumn } from 'typeorm';
import { Album } from './album.entity';

@Entity('album_view_log')
export class AlbumViewLog {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'int', default: 0 })
    count: number;

    @ManyToOne(type => Album)
    album: Album;

    @Index()
    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt: Date;
}
