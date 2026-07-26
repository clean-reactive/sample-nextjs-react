import { factoryT } from 'factory-t';
import { CreateUser } from '@/src/entities/models/user';
import { userIdFactory } from '@/src/entities/models/user.factory';
import { usernameFactory } from '@/src/entities/models/username.factory';
import { passwordFactory } from '@/src/entities/models/password.factory';

export const createUserFactory = factoryT<CreateUser>({
  id: userIdFactory,
  username: () => usernameFactory.item().username,
  password: () => passwordFactory.item().password,
});
