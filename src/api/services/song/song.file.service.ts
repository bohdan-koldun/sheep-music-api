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
        const song = await this.songRepo.findOneOrFail({where: {id}, relations: ['author', 'album', 'audioMp3', 'phonogramMp3']} );

        const {songMp3, phonogramMp3} = (files || {});
        let audioAttachment: Attachment;
        let phonogramAttachment: Attachment;

        try {

            if (songMp3?.[0]) {
                audioAttachment = await this.attachmentService.saveMp3(songMp3[0], song);
            }

            if (phonogramMp3?.[0]) {
                phonogramAttachment = await this.attachmentService.saveMp3(phonogramMp3[0], song, 'phonogram');
            }

            const { audioMp3: oldAudio, phonogramMp3: oldPhonogram } = song;

            const result = await this.songRepo.save({
                ...song,
                phonogramMp3: phonogramAttachment || oldPhonogram,
                audioMp3: audioAttachment || oldAudio,
            });

            if (phonogramAttachment) {
                this.attachmentService.removeAttachment(oldPhonogram);
            }

            if (audioAttachment) {
                this.attachmentService.removeAttachment(oldAudio);
            }

            return result;
        } catch (error) {
            await this.attachmentService.removeAttachment(audioAttachment);
            await this.attachmentService.removeAttachment(phonogramAttachment);

            throw new HttpException('Ошибка сохранения mp3 файлов!', HttpStatus.BAD_REQUEST);
        }

    }

}
