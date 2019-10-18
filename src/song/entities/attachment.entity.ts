import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('attachments')
export class Attachment {
    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 500 })
    path: string;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true })
    awsKey: string;
}
