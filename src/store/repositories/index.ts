import { CarsRepository } from './cars.repository';
import { CarsCategoriesRepository } from './cars_categories.repository';
import { CarsCustomersRepository } from './cars_customers.repository';
import { UsersCustomersRepository } from './users_customers.repository';
interface MyConditions {
  [key: string]: string | boolean | number | Date;
}
interface IExtensions {
  find: (
    table: string,
    query?: MyConditions,
    columns?: string[]
  ) => Promise<any>;
  findById: (table: string, id: string, columns?: string[]) => Promise<any>;
  create: (table: string, data: any, columns?: string[]) => Promise<any>;
  update: (table: string, data: any, id: string) => Promise<any>;
  isValid: (item: { key: string; value: string }) => Promise<any>;
  cars: CarsRepository;
  cars_categories: CarsCategoriesRepository;
  cars_customers: CarsCustomersRepository;
  users_customers: UsersCustomersRepository;
}

export {
  IExtensions,
  MyConditions,
  CarsRepository,
  CarsCategoriesRepository,
  CarsCustomersRepository,
  UsersCustomersRepository,
};
