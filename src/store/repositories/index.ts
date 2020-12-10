import { CarsRepository } from './cars.repository';
import { CarsCategoriesRepository } from './cars_categories.repository';
import { CarsCustomersRepository } from './cars_customers.repository';
import { UsersCustomersRepository } from './users_customers.repository';
import { CustomersRepository } from './customers.repository';
import { BrandsRepository } from './brands.repository';
import { CategoriesRepository } from './categories.repository';
import { ModelsRepository } from './models.repository';
import { RolesRepository } from './roles.repository';
import { UsersRepository } from './users.repository';
import { VersionsRepository } from './versions.repository';
interface MyConditions {
  [key: string]: string | boolean | number | Date | null;
}
interface IExtensions {
  isValid: (item: { key: string; value: string }) => Promise<any>;
  cars: CarsRepository;
  customers: CustomersRepository;
  brands: BrandsRepository;
  categories: CategoriesRepository;
  models: ModelsRepository;
  roles: RolesRepository;
  users: UsersRepository;
  versions: VersionsRepository;
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
  CustomersRepository,
  BrandsRepository,
  CategoriesRepository,
  ModelsRepository,
  RolesRepository,
  UsersRepository,
  VersionsRepository,
};
