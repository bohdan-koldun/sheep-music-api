import { Column, Entity, PrimaryGeneratedColumn, Index, ManyToOne } from 'typeorm';
import { Album } from './album.entity';

@Entity('author_view_log')
export class AuthorViewLog {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: false })
    date: string;

    @Column({ type: 'int', default: 0 })
    count: number;

    @ManyToOne(type => Album)
    album: Album;
}
