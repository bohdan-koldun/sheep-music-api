import {
    Controller, Inject, Get, Request, CacheKey,
    CacheTTL, UseInterceptors, CacheInterceptor, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles, GetUser } from '../../common/decorators';
import { StatisticService } from '../services';
import { User } from '../../user/entities/user.entity';

@Controller('statistic')
@UseInterceptors(CacheInterceptor)
export class StatisticController {
    @Inject()
    private readonly statisticService: StatisticService;

    @Get('top')
    topLists(@Request() request) {
        return this.statisticService.getTopLists(
            request ?.query ?.count || 10,
            request ?.query ?.days || 30,
        );
    }

    @Get('top/songs')
    topSongs(@Request() request) {
        return this.statisticService.getTopSongs(
            request ?.query ?.count || 10,
            request ?.query ?.days || 30,
        );
    }

    @Get('top/albums')
    topAlbums(@Request() request) {
        return this.statisticService.getTopAlbums(
            request ?.query ?.count || 10,
            request ?.query ?.days || 30,
        );
    }

    @Get('top/authors')
    topAuthors(@Request() request) {
        return this.statisticService.getTopAuthors(
            request ?.query ?.count || 10,
            request ?.query ?.days || 30,
        );
    }

    @Get('moderator')
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    moderatorStatistic(@GetUser() authUser: User) {
        return this.statisticService.getModeratorStatistic(authUser);
    }

}
