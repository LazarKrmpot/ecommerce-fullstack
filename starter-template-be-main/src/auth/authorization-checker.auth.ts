// src/middlewares/authorizationChecker.ts
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
    /********************************************************************
     * 1. Try to parse the JWT. If it fails we treat requester as Guest. *
     ********************************************************************/
    let userRole: RoleType = 'guest' as RoleType;
    let userDocument: any = null; // will stay null for guests

    try {
      const { id } = await authService.parseTokenFromRequest(action.request);

      if (id) {
        userDocument = await userService.findOneById(id, { Model: UserType });
        if (userDocument) userRole = userDocument.role;
      }
    } catch (e) {
      log.warn('Failed to parse JWT from request', e);
    }

    /******************************************************
     * 2. Check if the resolved role is authorised.       *
     ******************************************************/
    const allowed = roles.includes(userRole);

    if (!allowed) {
      log.warn(
        `Unauthorized access. Required: [${roles.join(
          ', ',
        )}], Got: ${userRole}`,
      );
      return false;
    }

    /******************************************************
     * 3. Attach a user‑like object to the request so     *
     *    controllers can rely on action.request.user.    *
     ******************************************************/
    action.request.user =
      userDocument ??
      ({
        role: 'guest',
        name: 'Guest',
        email: null,
        deliveryAddresses: [],
      } as unknown as Partial<UserType>);

    log.info(`Credentials OK — acting as ${userRole}`);
    return true;
  };
}
