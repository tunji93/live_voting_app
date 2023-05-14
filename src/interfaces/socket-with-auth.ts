import { Socket } from 'socket.io';
import { AddParticipant } from './add-participant';

export type SocketWithAuth = AddParticipant & Socket;
