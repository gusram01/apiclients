import { Document } from 'mongoose';

export interface Person extends Document {
  creado: Date;
  borrado: Date;
  nacimiento: Date;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string | undefined;
  emailstatefalse: string | undefined;
  category: string;
  password: string;
  state: Boolean;
  slug: string;
  resetPassword: string | undefined;
  resetPaswordExpire: Date | undefined;
  validateSign: (password: string) => Promise<boolean>;
  getSignJWT: () => string;
  getTokenTemporal: () => Promise<string>;

};

