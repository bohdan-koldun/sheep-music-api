
import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Repository, Connection } from 'typeorm';
import { RoleUser } from '../../user/entities';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly roleuserRepo: Repository<RoleUser>;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly conection: Connection,
    private readonly reflector: Reflector,
  ) {
    this.roleuserRepo = this.conection.getRepository(RoleUser);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userRoles = await this.roleuserRepo.find({
      relations: ['role'],
      where: { user },
    });

    const hasRole = () =>
      userRoles.some(userRole => !!roles.find(item => item === userRole.role.slug));

    return user && hasRole();
  }
}
