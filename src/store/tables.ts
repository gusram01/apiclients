export interface MyPermissions {
  type: string;
  methods: string[];
  access: string;
}

export interface TableDescription {
  table: string;
  permissions: MyPermissions[];
}

/**
 *  restrictions: {
 *    field: {
 *      _id: read,
 *    },
 *    field: {
 *      roles_id: read,
 *    }
 *  }
 */

export const appTables: TableDescription[] = [
  {
    table: 'roles',
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
    permissions: [
      {
        type: 'USER',
        // PUT ALL EXCEPT roles_id
        methods: ['GET', 'PUT', 'DELETE'],
        access: 'self',
      },
      {
        type: 'MANAGER',
        // PUT ALL EXCEPT roles_id
        methods: ['GET', 'PUT', 'DELETE'],
        access: 'self',
      },
      {
        type: 'ADMIN',
        // PUT ALL EXCEPT password
        methods: ['GET', 'PUT', 'DELETE'],
        access: 'all',
      },
    ],
  },
  {
    table: 'login',
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
    permissions: [
      {
        type: 'USER',
        methods: ['GET', 'POST'],
        access: 'all',
      },
      {
        type: 'MANAGER',
        methods: ['GET', 'PUT'],
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
    permissions: [
      {
        type: 'USER',
        // PUT only optype, oparea, finished
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
