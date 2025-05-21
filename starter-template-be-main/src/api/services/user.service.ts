import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { HttpError } from 'routing-controllers';
import { Inject, Service } from 'typedi';

import { User } from 'api/models/user.model';
import { env } from 'env';
import { CRUD } from 'utils/models/CRUD';

@Service()
export class UserService extends CRUD<User> {
  constructor(
    @Inject(User.name)
    private readonly userModel: Model<User>,
  ) {
    super(User, userModel);
  }

  public async login(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .lean()
      .orFail(new HttpError(404, 'User not found'));

    const isValidPassword = await bcrypt.compare(
      password,
      user?.password || '',
    );

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ id: user?._id }, env.app.decodeKey || '', {});
    return { token };
  }
}
