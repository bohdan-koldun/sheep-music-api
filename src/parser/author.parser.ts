import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { Repository, Connection } from 'typeorm';
import * as cheerio from 'cheerio';
import { AttachmentService } from '../song/services';
import { Author } from '../song/entities/author.entity';
import { getUrlHtml, downloadFileFromUrl } from '../utils/axios.uploader';

@Injectable()
export class AuthorParserService implements OnModuleInit {
    @Inject()
    private readonly attachmentService: AttachmentService;

    private readonly authorRepo: Repository<Author>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
    ) {
        this.authorRepo = this.conection.getRepository(Author);
    }

    public async downloadAvatars() {
        const limit = 10;
        let page = 0;
        let results;
        let total;

        do {
            [results, total] = await this.authorRepo
                .createQueryBuilder('author')
                .leftJoinAndSelect('author.songs', 'songs')
                .leftJoinAndSelect('author.thumbnail', 'thumbnail')
                .skip(page * limit)
                .take(limit)
                .where('author.thumbnail IS NULL')
                .getManyAndCount();

            page++;

            await results.forEach(async (author) => {
                const songUrl = author.songs[0].parsedSource;
                const html = await getUrlHtml(songUrl) as string;

                let $ = cheerio.load(html || '');
                const authorUrl = $('.text-muted:contains("Исполнитель:") a').first().attr('href');

                if (authorUrl) {
                    const authorHtml = await getUrlHtml(`https://holychords.com/${authorUrl}`) as string;

                    $ = cheerio.load(authorHtml || '');
                    const avatarSrc = $('.bg-white.p-2 img').first().attr('src');
                    const authorDescription = $('#track_list').text();

                    if (avatarSrc) {
                        const img = await downloadFileFromUrl(`https://holychords.com/${avatarSrc}`);

                        const newAuthor = {
                            thumbnail: await this.attachmentService
                                .saveSquareImageAttachment(
                                    { mimetype: 'png', buffer: img, originalname: avatarSrc },
                                    400,
                                    author.slug,
                                    null,
                                ),
                            id: author.id,
                            description: author.description || authorDescription,
                        };

                        await this.authorRepo.save(newAuthor);

                        Logger.log(`${author.slug} - ${total}`);
                    }
                }

            });
        } while (results && results.length);
    }

    async onModuleInit() {
        // await this.downloadAvatars();
    }

}
