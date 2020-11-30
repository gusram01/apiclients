export interface Customers {
  _id?: string;
  curp: string;
  curp_e?: string;
  firstname: string;
  lastname: string;
  mobile: string;
  gender: string;
  phone?: string;
  email: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: string | number | boolean | Date | undefined;
}
