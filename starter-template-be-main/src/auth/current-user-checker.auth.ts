import { Action } from 'routing-controllers';

export function currentUserChecker(): (action: Action) => Promise<undefined> {
  return async function innerCurrentUserChecker(
    action: Action,
  ): Promise<undefined> {
    return action.request.user;
  };
}
