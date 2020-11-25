export const appRoles = [
  {
    role: 'USER',
    tables: [
      {
        table: 'login',
        methods: ['POST'],
        constraints: 'none',
      },
      {
        table: 'users',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'self',
      },
      {
        table: 'users_customers',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'self',
      },
      {
        table: 'customers',
        methods: ['POST', 'GET', 'PUT'],
        constraints: 'self',
      },
      {
        table: 'cars',
        methods: ['POST', 'GET'],
        constraints: 'all',
      },
      {
        table: 'cars_categories',
        methods: ['POST', 'GET'],
        constraints: 'all',
      },
      {
        table: 'cars_customers',
        methods: ['POST', 'GET'],
        constraints: 'self',
      },
      {
        table: 'categories',
        methods: ['POST', 'GET'],
        constraints: 'all',
      },
      {
        table: 'brands',
        methods: ['GET'],
        constraints: 'all',
      },
      {
        table: 'models',
        methods: ['GET'],
        constraints: 'all',
      },
      {
        table: 'versions',
        methods: ['GET'],
        constraints: 'all',
      },
      {
        table: 'roles',
        methods: ['GET'],
        constraints: 'all',
      },
    ],
  },
  {
    role: 'ADMIN',
    tables: [
      {
        table: 'login',
        methods: ['POST'],
        constraints: 'none',
      },
      {
        table: 'users',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'users_customers',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'customers',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'cars',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'cars_categories',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'cars_customers',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'categories',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'brands',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'models',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'versions',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'roles',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
    ],
  },
  {
    role: 'MANAGER',
    tables: [
      {
        table: 'login',
        methods: ['POST'],
        constraints: 'none',
      },
      {
        table: 'users',
        methods: ['POST', 'PUT', 'GET', 'DEL'],
        constraints: 'self',
      },
      {
        table: 'users_customers',
        methods: ['GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'customers',
        methods: ['PUT', 'GET', 'DEL'],
        constraints: 'all',
      },
      {
        table: 'cars',
        methods: ['POST', 'PUT', 'GET'],
        constraints: 'all',
      },
      {
        table: 'cars_categories',
        methods: ['POST', 'PUT', 'GET'],
        constraints: 'all',
      },
      {
        table: 'cars_customers',
        methods: ['POST', 'GET'],
        constraints: 'all',
      },
      {
        table: 'categories',
        methods: ['POST', 'PUT', 'GET'],
        constraints: 'all',
      },
      {
        table: 'brands',
        methods: ['POST', 'PUT', 'GET'],
        constraints: 'all',
      },
      {
        table: 'models',
        methods: ['POST', 'PUT', 'GET'],
        constraints: 'all',
      },
      {
        table: 'versions',
        methods: ['POST', 'PUT', 'GET'],
        constraints: 'all',
      },
      {
        table: 'roles',
        methods: ['GET'],
        constraints: 'all',
      },
    ],
  },
];
