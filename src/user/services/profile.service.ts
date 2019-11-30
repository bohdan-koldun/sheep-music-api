import { Injectable, Inject, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { User, Confirmation } from '../entities';
import { UserDTO } from '../dto';
import { ConfigService } from 'nestjs-config';
import { MailerService } from '@nest-modules/mailer';

@Injectable()
export class ProfileService {
    private readonly userRepo: Repository<User>;
    private readonly confirmRepo: Repository<Confirmation>;

    constructor(
        @Inject('DATABASE_CONNECTION')
        private readonly conection: Connection,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,

    ) {
        this.userRepo = this.conection.getRepository(User);
        this.confirmRepo = this.conection.getRepository(Confirmation);
    }

    async getUserInfo(id: number): Promise<User> {
        return await this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.role', 'role')
            .loadRelationCountAndMap('user.songs', 'user.songs')
            .loadRelationCountAndMap('user.authors', 'user.authors')
            .where('user.id =:id', { id })
            .getOne();
    }

    async editUserInfo(data: UserDTO, id: number): Promise<{ user: User, confirm: Confirmation }> {
        const { name, email, phone } = data;
        let user = await this.userRepo.findOne({ id });
        if (!user) {
            throw new HttpException(
                'Cannot find user',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (name) {
            user.name = name;
        }

        user.phone = phone;
        user = await this.userRepo.save(user);

        let confirm;
        if (email && user.email !== email) {
            confirm = await this.confirmRepo.findOne({ user });
            confirm.newEmail = email;
            confirm.emailCode = Confirmation.genarateTokenCode();
            confirm = await this.confirmRepo.save(confirm);
            this.sendConfirmNewEmail(user, confirm);
        }

        return await { user, confirm };
    }

    private async sendConfirmNewEmail(user: User, confirm: Confirmation): Promise<void> {
        const confirmationLink =
            `${this.configService.get('app.url')}` +
            `/registration/confirm?email=` +
            `${confirm.newEmail}&code=${confirm.emailCode}`;

        try {
            await this
                .mailerService
                .sendMail({
                    to: user.email,
                    subject: 'Confirmation New Email',
                    html: `
                    <p>Hello, <b> ${user.name}</b>!</p>
                    <p>Confirm change your email by visiting the link below:</p>
                    <a href='${confirmationLink}'>${confirmationLink}</a>
                    `,
                });
        } catch (error) {
            Logger.error(error.message, error);
        }

    }
}
