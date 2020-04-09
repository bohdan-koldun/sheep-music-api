import {
    Controller, Inject, Get, Request, CacheKey,
    CacheTTL, UseInterceptors, CacheInterceptor, UseGuards,
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {Roles, GetUser} from '../../common/decorators';
import { StatisticService } from '../services';
import { User } from '../../user/entities/user.entity';

@Controller('statistic')
@UseInterceptors(CacheInterceptor)
export class StatisticController {
    @Inject()
    private readonly statisticService: StatisticService;

    @Get('top')
    // @CacheKey('statistic_top')
    // @CacheTTL(10800)
    topLists(@Request() request) {
        return this.statisticService.getTopLists(
            request.query.hasOwnProperty('count') && request.query.count || 10,
            request.query.hasOwnProperty('filter') && request.query.filter || 'popular',
        );
    }

    @Get('moderator')
    @Roles('admin', 'moderator')
    @UseGuards(AuthGuard('jwt'))
    moderatorStatistic( @GetUser() authUser: User) {
        return this.statisticService.getModeratorStatistic(authUser);
    }

}
