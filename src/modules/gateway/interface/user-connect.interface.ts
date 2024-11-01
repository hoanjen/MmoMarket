import { Socket } from 'socket.io';
import { User } from 'src/modules/user/entity/user.entity';

export interface AuthenticatedSocket extends Socket {
  readonly sub: string;
  readonly username: string;
}

export interface IDataChat {
  readonly id: string;
  readonly member_id: string;
  readonly group_id: string;
  readonly user_id: string;
  readonly text: string;
  readonly file_name: string;
  readonly file: string;
  readonly user: User;
  readonly created_at: string;
  readonly updated_at: string;
}
