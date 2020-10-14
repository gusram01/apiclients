import { Document } from 'mongoose';

export interface Users extends Document {
  nick: string;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  create?: Date;
  delete?: Date;
  phone?: string;
  category?: string;
  state?: Boolean;
  resetPassword?: string | undefined;
  resetPaswordExpire?: Date | undefined;
}
