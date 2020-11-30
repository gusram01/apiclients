export interface Versions {
  _id?: string;
  description: string;
  models_id: number;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  [key: string]: string | number | boolean | Date | undefined;
}
