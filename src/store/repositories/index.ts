import { UsersRepository } from './users.repository';
import { CustomersRepository } from './customers.repository';
import { CarsRepository } from './cars.repository';
import { BrandsRepository } from './brands.repository';
import { ModelsRepository } from './models.repository';
import { VersionsRepository } from './versions.repository';
import { CategoriesRepository } from './categories.repository';
import { RolesRepository } from './roles.repository';
import { CarsCategoriesRepository } from './cars_categories.repository';
import { CarsCustomersRepository } from './cars_customers.repository';
import { UsersCustomersRepository } from './users_customers.repository';

interface IExtensions {
  users: UsersRepository;
  customers: CustomersRepository;
  cars: CarsRepository;
  categories: CategoriesRepository;
  versions: VersionsRepository;
  models: ModelsRepository;
  brands: BrandsRepository;
  roles: RolesRepository;
  cars_categories: CarsCategoriesRepository;
  cars_customers: CarsCustomersRepository;
  users_customers: UsersCustomersRepository;
}

export {
  IExtensions,
  UsersRepository,
  CustomersRepository,
  CarsRepository,
  CategoriesRepository,
  VersionsRepository,
  ModelsRepository,
  BrandsRepository,
  RolesRepository,
  CarsCategoriesRepository,
  CarsCustomersRepository,
  UsersCustomersRepository,
};
