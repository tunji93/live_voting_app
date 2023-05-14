import { Request } from 'express';
import { AddParticipant } from './add-participant';

export type RequestWithAuth = Request & AddParticipant;
