import { Controller, Inject, Get, Request } from '@nestjs/common';
import { StatisticService } from '../services';

@Controller('statistic')
export class StatisticController {
    @Inject()
    private readonly statisticService: StatisticService;

    @Get('top')
    topLists(@Request() request) {
        return this.statisticService.getTopLists(
            request.query.hasOwnProperty('count') && request.query.count || 10,
            request.query.hasOwnProperty('filter') && request.query.filter || 'popular',
        );
    }

}
