import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Attachment } from './attachment.entity';
import { Song } from './song.entity';
import { Album } from './album.entity';

@Entity('authors')
export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true  })
    slug: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 500, nullable: true, select: false })
    parsedSource: string;

    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: Date;

    @OneToOne(type => Attachment, { cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    thumbnail: Attachment;

    @OneToMany(type => Song, song => song.author)
    songs: Song[];

    @OneToMany(type => Album, album => album.author)
    albums: Album[];
}
