import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../user/entities/role.entity';
import { RoleUser } from '../../user/entities/role.user.entity';

export class UserSeeds1559035874837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const userRepo = queryRunner.manager.getRepository(User);
        const roleRepo = queryRunner.manager.getRepository(Role);
        const roleUserRepo = queryRunner.manager.getRepository(RoleUser);

        let admin = await userRepo.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'Secret22323',
            isEmailConfirmed: true,

        });

        let user = await userRepo.create({
            name: 'User',
            email: 'user@example.com',
            password: 'Secret22323',
            isEmailConfirmed: true,
        });

        user = await userRepo.save(user);
        admin = await userRepo.save(admin);

        let adminRole = await roleRepo.create({
            name: 'Admin',
            slug: 'admin',
            description: 'manage administration privileges',
        });

        let userRole = await roleRepo.create({
            name: 'User',
            slug: 'user',
            description: 'has user privileges',
        });

        adminRole = await roleRepo.save(adminRole);
        userRole = await roleRepo.save(userRole);

        const roleUserAdmin = roleUserRepo.create({
            role: adminRole,
            user: admin,

        });

        const roleUseruser = roleUserRepo.create({
            role: userRole,
            user,
        });

        await roleUserRepo.save(roleUseruser);
        await roleUserRepo.save(roleUserAdmin);

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const userRepo = queryRunner.manager.getRepository(User);
        const roleRepo = queryRunner.manager.getRepository(Role);

        await userRepo.delete({ email: 'user@example.com' });
        await userRepo.delete({ email: 'admin@example.com' });

        await roleRepo.delete({ slug: 'admin' });
        await roleRepo.delete({ slug: 'user' });
    }

}
