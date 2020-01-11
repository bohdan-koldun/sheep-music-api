import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { Schedule, InjectSchedule } from 'nest-schedule';
import { TagsService } from '../api/services';

@Injectable()
export class DatabaseChangesScheduleService implements OnModuleInit {
    @Inject()
    private readonly tagsService: TagsService;
    constructor(
        @InjectSchedule() private readonly schedule: Schedule,

    ) { }

    onModuleInit(): void {
        this.schedule.scheduleCronJob('start parser every day', '0 0 12 * * ?', () => {
            Logger.log(`Start scheduleCronJob(): '0 0 12 * * ?'`);
            return false;
        }, {});

        this.schedule.scheduleTimeoutJob('start DatabaseChangesScheduleService with server', 1000, () => {
            Logger.log(`start DatabaseChangesScheduleService with server`);
            return false;
        });
    }
}
