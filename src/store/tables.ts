export interface MyPermissions {
  type: string;
  methods: string[];
  access: string;
}

export interface TableDescription {
  table: string;
  fields: string[];
  permissions: MyPermissions[];
}

export const appTables: TableDescription[] = [
  {
    table: 'roles',
    fields: ['_id', 'description'],
    permissions: [
      {
        type: 'USER',
        methods: ['GET'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['GET'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'brands',
    fields: ['_id', 'name'],
    permissions: [
      {
        type: 'USER',
        methods: ['GET'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['GET', 'PUT', 'POST'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'categories',
    fields: ['_id', 'name'],
    permissions: [
      {
        type: 'USER',
        methods: ['GET'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['GET', 'PUT', 'POST'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'models',
    fields: ['_id', 'brands_id', 'name'],
    permissions: [
      {
        type: 'USER',
        methods: ['GET'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['GET', 'PUT', 'POST'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'versions',
    fields: ['_id', 'models_id', 'name'],
    permissions: [
      {
        type: 'USER',
        methods: ['GET'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['GET', 'PUT', 'POST'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'users',
    fields: ['_id', 'roles_id', 'nick', 'password', 'email', 'img_url'],
    permissions: [
      {
        type: 'USER',
        methods: ['POST', 'PUT', 'GET', 'DELETE'],
        access: 'self',
      },
      {
        type: 'MANAGER',
        methods: ['POST', 'PUT', 'GET', 'DELETE'],
        access: 'self',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'login',
    fields: ['_id', 'roles_id', 'nick', 'password', 'email', 'img_url'],
    permissions: [
      {
        type: 'USER',
        methods: ['POST'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['POST'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['POST'],
        access: 'all',
      },
    ],
  },
  {
    table: 'signup',
    fields: ['_id', 'roles_id', 'nick', 'password', 'email', 'img_url'],
    permissions: [
      {
        type: 'USER',
        methods: ['POST'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['POST'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['POST'],
        access: 'all',
      },
    ],
  },
  {
    table: 'customers',
    fields: [
      '_id',
      'curp',
      'firstname',
      'lastname',
      'email',
      'mobile',
      'gender',
      'phone',
    ],
    permissions: [
      {
        type: 'USER',
        methods: ['POST', 'PUT', 'GET'],
        access: 'self',
      },
      {
        type: 'MANAGER',
        methods: ['PUT', 'GET'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'cars',
    fields: ['_id', 'brands_id', 'models_id', 'versions_id', 'price'],
    permissions: [
      {
        type: 'USER',
        methods: ['GET', 'POST'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['POST', 'PUT', 'GET'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'operations',
    fields: [
      '_id',
      'cars_customers_id',
      'users_customers_id',
      'optype',
      'oparea',
      'finished',
    ],
    permissions: [
      {
        type: 'USER',
        methods: ['GET', 'POST', 'PUT'],
        access: 'self',
      },
      {
        type: 'MANAGER',
        methods: ['PUT', 'GET'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'cars_categories',
    fields: ['_id', 'cars_id', 'categories_id'],
    permissions: [
      {
        type: 'USER',
        methods: ['GET', 'POST', 'PUT'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['POST', 'PUT', 'GET'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'cars_customers',
    fields: ['_id', 'cars_id', 'customers_id'],
    permissions: [
      {
        type: 'USER',
        methods: ['GET', 'POST', 'PUT'],
        access: 'self',
      },
      {
        type: 'MANAGER',
        methods: ['PUT', 'GET'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'users_customers',
    fields: ['_id', 'users_id', 'customers_id'],
    permissions: [
      {
        type: 'USER',
        methods: ['GET', 'POST'],
        access: 'self',
      },
      {
        type: 'MANAGER',
        methods: ['PUT', 'GET'],
        access: 'all',
      },
      {
        type: 'ADMIN',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        access: 'all',
      },
    ],
  },
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
