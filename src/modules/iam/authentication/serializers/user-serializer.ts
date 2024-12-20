import { PassportSerializer } from '@nestjs/passport';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { User } from '@prisma/client';

export class UserSerializer extends PassportSerializer {
  async deserializeUser(
    payload: ActiveUserData,
    done: (err: Error, payload: ActiveUserData) => void,
  ): Promise<any> {
    done(null, payload);
  }

  serializeUser(
    user: User,
    done: (err: Error, payload: ActiveUserData) => void,
  ) {
    done(null, {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });
  }
}
