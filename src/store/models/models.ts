export interface Models {
  _id?: string;
  description: string;
  brands_id: number;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: string | number | boolean | Date | undefined;
}
