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
} from './services';

export const apiProviders = [
    SongParserService,
    SongService,
    SongAddService,
    PrettifyService,
    AlbumService,
    AuthorService,
    VideoService,
    AttachmentService,
    TagsService,
    StatisticService,
];
