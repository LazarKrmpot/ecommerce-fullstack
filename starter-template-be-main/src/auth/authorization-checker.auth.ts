import { RoleType, Roles } from 'api/models/user.model';
import { AuthService } from 'api/services/auth.service';
import { UserService } from 'api/services/user.service';
import { UserType } from 'api/types/user.type';
import { Action } from 'routing-controllers';
import Container from 'typedi';
import { Logger } from 'utils/logger';

export function authorizationChecker(): (
  action: Action,
  roles: Roles[],
) => Promise<boolean> | boolean {
  const log = new Logger(__filename);

  const authService = Container.get<AuthService>(AuthService);
  const userService = Container.get<UserService>(UserService);

  return async function innerAuthorizationChecker(
    action: Action,
    roles: RoleType[],
  ): Promise<boolean> {
    const { id } = await authService.parseTokenFromRequest(action.request);
    const user = await userService.findOneById(id, {
      Model: UserType,
    });

    if (!roles.includes(user.role)) {
      log.warn('Unauthorized access');
      return false;
    }

    action.request.user = user;
    log.info('Successfully checked credentials');

    return true;
  };
}
