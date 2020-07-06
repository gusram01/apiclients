import { Document } from 'mongoose';

export interface Users extends Document {
  create: Date;
  delete: Date;
  born: Date;
  firstname: string;
  lastname: string;
  phone: string;
  email: string | undefined;
  password: string;
  category: string;
  state: Boolean;
  resetPassword: string | undefined;
  resetPaswordExpire: Date | undefined;

}
