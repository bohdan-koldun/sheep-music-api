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
    SongEditService,
    SongFileService,
} from './services';

export const apiProviders = [
    SongParserService,
    SongService,
    SongAddService,
    SongEditService,
    SongFileService,
    PrettifyService,
    AlbumService,
    AuthorService,
    VideoService,
    AttachmentService,
    TagsService,
    StatisticService,
];
