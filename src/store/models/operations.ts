export interface Operations {
  _id?: string;
  users_customers_id: string;
  cars_customers_id: string;
  optype: string;
  oparea: string;
  finished?: boolean;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: Date | string | boolean | undefined;
}
