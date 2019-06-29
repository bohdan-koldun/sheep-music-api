import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attachments')
export class Attachment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 500 })
    path: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    awsKey: string;
}
