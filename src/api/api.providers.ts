import {
    SongParserService,
    SongService,
    PrettifyService,
    AlbumService,
    AuthorService,
    VideoService,
    AttachmentService,
    TagsService,
    StatisticService,
    SongAddService,
    SongFileService,
} from './services';

export const apiProviders = [
    SongParserService,
    SongService,
    SongAddService,
    SongFileService,
    PrettifyService,
    AlbumService,
    AuthorService,
    VideoService,
    AttachmentService,
    TagsService,
    StatisticService,
];
