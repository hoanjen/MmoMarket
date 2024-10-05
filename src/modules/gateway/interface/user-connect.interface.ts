import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  readonly sub: string;
  readonly username: string;
}

export interface DataChat {
  readonly group_id: string;
  readonly sender_id: string;
  readonly text: string;
  readonly file_name: string;
  readonly file: string;
}
