import { Column, Entity, PrimaryGeneratedColumn, Index, ManyToOne, CreateDateColumn } from 'typeorm';
import { Author } from './author.entity';

@Entity('author_view_log')
export class AuthorViewLog {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', nullable: false })
    date: Date;

    @Column({ type: 'int', default: 0 })
    count: number;

    @ManyToOne(type => Author)
    author: Author;

    @Index()
    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt: Date;
}
