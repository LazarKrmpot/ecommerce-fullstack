import { Roles, User } from 'api/models/user.model';
import { UserService } from 'api/services/user.service';
import bcrypt from 'bcryptjs';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { env } from 'env';
import jwt from 'jsonwebtoken';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  Put,
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';

class PostUserBody {
  @IsString()
  public name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsEnum(Roles)
  @IsOptional()
  @IsString()
  public role: Roles;
}

class PostUserLoginBody {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

class PutMeBody {
  @IsString()
  @IsOptional()
  public name: string;

  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  public password: string;

  @IsEnum(Roles)
  @IsOptional()
  public role: Roles;
}

class GetMeResponse {
  @ValidateNested()
  @Type(() => User)
  data: User;
}

@JsonController('/auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/register')
  public async postUser(@Body() body: PostUserBody) {
    const { name, email, password, role } = body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const checkUser = await this.userService.findOne({ filter: { email } });

    if (checkUser) {
      throw new Error('User with this email already exists');
    }
    const id = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: id?._id }, env.app.decodeKey || '', {});
    return { token: token };
  }

  @Post('/login')
  public async login(@Body() body: PostUserLoginBody) {
    const { email, password } = body;
    const token = await this.userService.login(email, password);
    return { token };
  }

  @Get('/me')
  @Authorized(Object.values(Roles))
  @ResponseSchema(GetMeResponse)
  public async getMe(@CurrentUser() user: User) {
    const currentUser = await this.userService.findOneById(user, user._id);
    return { data: currentUser };
  }

  @Put('/me')
  @Authorized(Object.values(Roles))
  @ResponseSchema(PutMeBody)
  public async putMe(@CurrentUser() user: User, @Body() body: PutMeBody) {
    const { name, email, password, role } = body;

    await this.userService.updateOneById(user._id, {
      name,
      email,
      password,
      role,
    });

    return { message: 'User updated' };
  }
}
