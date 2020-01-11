import {
    Controller, Inject, Get, Request, CacheKey,
    CacheTTL, UseInterceptors, CacheInterceptor,
} from '@nestjs/common';
import { StatisticService } from '../services';

@Controller('statistic')
@UseInterceptors(CacheInterceptor)
export class StatisticController {
    @Inject()
    private readonly statisticService: StatisticService;

    @Get('top')
    @CacheKey('statistic_top')
    @CacheTTL(10800)
    topLists(@Request() request) {
        return this.statisticService.getTopLists(
            request.query.hasOwnProperty('count') && request.query.count || 10,
            request.query.hasOwnProperty('filter') && request.query.filter || 'popular',
        );
    }

}
