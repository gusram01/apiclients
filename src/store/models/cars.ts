export interface Cars {
  _id?: string;
  brands_id: number;
  models_id: number;
  versions_id: number;
  price: number;
  description: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: string | number | boolean | Date | undefined;
}
