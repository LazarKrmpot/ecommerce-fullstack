import { Ref } from '@typegoose/typegoose';
import { Roles, User } from 'api/models/user.model';
import { UserService } from 'api/services/user.service';
import { FilterQueryParams } from 'api/types/filter.types';
import { plainToInstance } from 'class-transformer';
import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Put,
  QueryParams,
} from 'routing-controllers';

@JsonController('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  @Authorized(Roles.ADMIN)
  public async getAllUsers(
    @QueryParams() queryParams: FilterQueryParams<User>,
  ) {
    const { limit, page, sort, filter } = plainToInstance(
      FilterQueryParams,
      queryParams,
    );

    const { data: users, meta } = await this.userService.filter({
      limit,
      page,
      sort,
      filter,
    });

    if (!users.length) {
      return {
        data: [],
        meta: {
          page: 0,
          limit: 0,
          total: 0,
        },
      };
    }

    return { data: users, meta };
  }

  @Put('/:id')
  @Authorized(Roles.ADMIN)
  public async updateUser(@Param('id') id: Ref<User>, @Body() user: Ref<User>) {
    const { name, email } = user;
    const existingUser = await this.userService.findOneById(id);
    if (!existingUser) {
      return { message: 'User not found' };
    }

    await this.userService.updateOneById(id, {
      name,
      email,
    });

    const updatedUser = await this.userService.findOneById(id);

    return {
      message: 'User updated successfully',
      data: updatedUser,
    };
  }

  @Delete('/:id')
  @Authorized(Roles.ADMIN)
  public async deleteUser(@Param('id') id: Ref<User>) {
    await this.userService.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }
}
