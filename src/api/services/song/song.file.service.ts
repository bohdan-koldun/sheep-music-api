import {Injectable, Inject, HttpException, HttpStatus} from '@nestjs/common';
import {Connection, Repository} from 'typeorm';
import {Song} from '../../entities/song.entity';
import {User} from '../../../user/entities';
import {AttachmentService} from '../index';
import {Attachment} from '../../entities/attachment.entity';

@Injectable()
export class SongFileService {
    @Inject()
    private readonly attachmentService: AttachmentService;

    private readonly songRepo: Repository<Song>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly connection: Connection,
    ) {
        this.songRepo = this.connection.getRepository(Song);
    }

    async addMp3Files(files: any, id, user: User) {
        const song = await this.songRepo.findOneOrFail({where: {id}, relations: ['author', 'album']} );

        const {songMp3, phonogramMp3} = (files || {});
        let attachmentSongMp3: Attachment;
        let attachmentPhonogramMp3: Attachment;

        try {

            if (songMp3?.[0]) {
                attachmentSongMp3 = await this.attachmentService.saveMp3(songMp3[0], song);
            }

            if (phonogramMp3?.[0]) {
                attachmentPhonogramMp3 = await this.attachmentService.saveMp3(phonogramMp3[0], song, 'phonogram');
            }

            await this.songRepo.save(song);

            return {attachmentSongMp3, attachmentPhonogramMp3};

        } catch (error) {
            await this.attachmentService.removeAttachment(attachmentSongMp3);
            await this.attachmentService.removeAttachment(attachmentPhonogramMp3);

            throw new HttpException('Ошибка сохранения mp3 файлов!', HttpStatus.BAD_REQUEST);
        }

    }

}
