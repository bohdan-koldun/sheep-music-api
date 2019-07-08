import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { Attachment } from './attachment.entity';
import { Song } from './song.entity';
import { Author } from './author.entity';

@Entity('albums')
export class Album {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true  })
    slug: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    year: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    iTunes: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    googlePlay: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    parsedSource: string;

    @OneToOne(type => Attachment, { cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    thumbnail: Attachment;

    @ManyToOne(type => Author, author => author.albums, { cascade: false, eager: true })
    author: Author;

    @OneToMany(type => Song, song => song.album)
    songs: Song[];
}
