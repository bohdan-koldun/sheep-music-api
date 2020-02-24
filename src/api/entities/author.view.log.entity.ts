import { Column, Entity, PrimaryGeneratedColumn, Index, ManyToOne } from 'typeorm';
import { Author } from './author.entity';

@Entity('author_view_log')
export class AuthorViewLog {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: false })
    date: string;

    @Column({ type: 'int', default: 0 })
    count: number;

    @ManyToOne(type => Author)
    author: Author;
}
