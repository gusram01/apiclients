import { UsersRepository } from './users.repository';
import { CustomersRepository } from './customers.repository';
import { CarsRepository } from './cars.repository';
import { BrandsRepository } from './brands.repository';
import { ModelsRepository } from './models.repository';
import { VersionsRepository } from './versions.repository';
import { CategoriesRepository } from './categories.repository';
import { RolesRepository } from './roles.repository';
import { CarsCategoriesRepository } from './cars_categories.repository';

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
};
