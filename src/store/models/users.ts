export interface Users {
  _id?: string;
  roles_id?: number;
  nick: string;
  password: string;
  email: string;
  email_e?: string;
  img_url?: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: string | number | boolean | Date | undefined;
}
