import { Module } from '@nestjs/common';
import { AuthorParserService } from './author.parser';

@Module({
    providers: [AuthorParserService],
})
export class ParserModule { }
