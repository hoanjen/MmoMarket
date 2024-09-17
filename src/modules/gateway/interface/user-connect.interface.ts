import {Socket} from 'socket.io'

export interface AuthenticatedSocket extends Socket{
    readonly sub : string,
    readonly username : string
}