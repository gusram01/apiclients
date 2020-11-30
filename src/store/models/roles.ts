export interface Roles {
  _id?: string;
  description: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: string | number | boolean | Date | undefined;
}
