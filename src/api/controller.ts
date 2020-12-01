import bcrypt from 'bcrypt';
import { Request } from 'express';
import { ExtendedProtocol } from '../store/database';
import { ErrorResponse } from '../utils/ErrorResponse';
import { getToken } from '../utils/utilities';
import { Users } from '../store/models/users';

type ValidTables =
  | 'users'
  | 'customers'
  | 'brands'
  | 'cars'
  | 'categories'
  | 'models'
  | 'versions'
  | 'roles'
  | 'carsCategories';

const Controller = (db: ExtendedProtocol) => {
  const getAll = async (req: Request) => {
    const table = req.params.table as ValidTables;
    try {
      const rows = await db[table].getAll(req);
      if (!rows) {
        throw new ErrorResponse(404, 'Info Not Found');
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const getSome = async (req: Request) => {
    const table = req.params.table as ValidTables;
    try {
      const rows = await db[table].getSome(req);
      if (!rows) {
        throw new ErrorResponse(404, 'Try with another condition');
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const getOne = async (req: Request) => {
    const table = req.params.table as ValidTables;
    try {
      const row = await db[table].oneById(req);
      if (!row) {
        throw new ErrorResponse(404, 'Id not found');
      }
      return row;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const newOne = async (req: Request) => {
    const table = req.params.table as ValidTables;
    try {
      const rows = await db[table].add(req);
      if (!rows) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const updateOne = async (req: Request) => {
    const table = req.params.table as ValidTables;
    try {
      const rows = await db[table].updateById(req);
      if (!rows) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const delOne = async (req: Request) => {
    const table = req.params.table as ValidTables;
    try {
      const row = await db[table].deleteById(req);
      if (!row) {
        throw new ErrorResponse(404, 'Id not found');
      }
      return row;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const roles = async (req: Request) => {
    try {
      const rows = await db.roles.getAll(req);
      if (!rows) {
        throw new ErrorResponse(404, 'Data not found');
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 400, e.message);
    }
  };

  const login = async (req: Request) => {
    const info: { email: string; password: string } = { ...req.body };
    if (!info) {
      throw new ErrorResponse(400, 'Please send email and password');
    }
    try {
      const row = await db.users.login(req);
      if (!row) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }

      const correctPass = await bcrypt.compare(info.password, row.password!);
      if (!correctPass) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }

      return {
        token: getToken(row._id!, row.email!, row.roles_id!.toString()),
        id: row._id,
      };
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  };

  const signup = async (req: Request) => {
    const user: Users = { ...req.body };
    if (!user) {
      throw new ErrorResponse(400, 'Please send username, email and password');
    }
    try {
      const row = await db.users.add(req);
      if (!row) {
        throw new ErrorResponse(400, 'Try again');
      }
      return {
        token: getToken(row._id!, row.email!, row.roles_id!.toString()),
        id: row._id,
      };
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  };

  const isValid = async (req: Request) => {
    const item = req.params as { key: string; value: string };
    try {
      const flag = await db.users.isValid(item);
      if (!flag) {
        return true;
      }
      return false;
    } catch (e) {
      throw new ErrorResponse(500, 'Oopss somethign wrong, please try again');
    }
  };

  return {
    getAll,
    getSome,
    getOne,
    newOne,
    updateOne,
    delOne,
    roles,
    login,
    signup,
    isValid,
  };
};

export default Controller;
