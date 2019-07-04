import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Attachment } from './attachment.entity';
import { Song } from './song.entity';
import { Album } from './album.entity';

@Entity('authors')
export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    parsedSource: string;

    @OneToOne(type => Attachment, { cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    thumbnail: Attachment;

    @OneToMany(type => Song, song => song.author)
    songs: Song[];

    @OneToMany(type => Album, album => album.author)
    albums: Album[];
}
