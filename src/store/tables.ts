export const Roles = ['_id', 'description'];
export const Brands = ['_id', 'name'];
export const Categories = ['_id', 'name'];
export const Models = ['_id', 'brands_id', 'name'];
export const Versions = ['_id', 'models_id', 'name'];
export const Users = [
  '_id',
  'roles_id',
  'nick',
  'password',
  'email',
  'img_url',
];
export const Customers = [
  '_id',
  'curp',
  'firstname',
  'lastname',
  'email',
  'mobile',
  'gender',
  'phone',
];
export const Cars = ['_id', 'brands_id', 'models_id', 'versions_id', 'price'];
export const Operations = [
  '_id',
  'cars_customers_id',
  'users_customers_id',
  'optype',
  'oparea',
  'finished',
];

// -- CREATE TABLE IF NOT EXISTS users_customers (
// --   _id SERIAL PRIMARY KEY,
// --   users_id UUID NOT NULL REFERENCES users(_id),
// --   customers_id UUID NOT NULL REFERENCES customers(_id)
// -- );
// -- CREATE TABLE IF NOT EXISTS cars_customers (
// --   _id SERIAL PRIMARY KEY,
// --   cars_id UUID REFERENCES cars(_id) ,
// --   customers_id UUID REFERENCES customers(_id)
// -- );
// -- CREATE TABLE IF NOT EXISTS cars_categories (
// --   _id SERIAL PRIMARY KEY,
// --   cars_id UUID REFERENCES cars(_id) ,
// --   categories_id INTEGER REFERENCES categories(_id)
// -- );
