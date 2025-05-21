import { env } from 'env';
import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Service } from 'typedi';

@Service()
export class AuthService {
  async parseTokenFromRequest(req: Request) {
    const authorization = req.header('authorization');
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      const token = authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.app.decodeKey);
      const { id } = decoded as JwtPayload;

      return { id };
    }

    return {
      id: null,
      type: null,
    };
  }
}
