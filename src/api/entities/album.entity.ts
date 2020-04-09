import {
    Column, Entity, PrimaryGeneratedColumn,
    OneToOne, JoinColumn, OneToMany, ManyToOne,
    CreateDateColumn, UpdateDateColumn, Index, ManyToMany,
} from 'typeorm';
import { Attachment } from './attachment.entity';
import { Song } from './song.entity';
import { Author } from './author.entity';
import { User } from '../../user/entities';
import { AlbumViewLog } from './album.view.log.entity';

@Entity('albums')
export class Album {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ type: 'varchar', length: 100, unique: true })
    slug: string;

    @Index()
    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 1500, nullable: true })
    description: string;

    @Index()
    @Column({ type: 'varchar', length: 10, nullable: true })
    year: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    iTunes: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    googlePlay: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    soundCloud: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    youtubeMusic: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    deezer: string;

    @Column({ type: 'varchar', length: 500, nullable: true, select: false })
    parsedSource: string;

    @Column({ type: 'int',  default: 0 })
    viewCount: number;

    @Column({ type: 'int',  default: 0 })
    likeCount: number;

    @Index()
    @CreateDateColumn({ name: 'created_at', nullable: false })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updatedAt: Date;

    @OneToOne(type => Attachment, { cascade: true, onDelete: 'CASCADE', eager: true })
    @JoinColumn()
    thumbnail: Attachment;

    @ManyToOne(type => Author, author => author.albums, { cascade: false, eager: true })
    author: Author;

    @OneToMany(type => Song, song => song.album)
    songs: Song[];

    @ManyToMany(type => User, user => user.albums, { cascade: false })
    users: User[];

    @ManyToOne(type => User)
    owner: User;

    @OneToMany(type => AlbumViewLog, viewLog => viewLog.album)
    viewLogs: AlbumViewLog[];
}
