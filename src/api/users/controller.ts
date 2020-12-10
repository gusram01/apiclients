import { Request } from 'express';
import { ExtendedProtocol } from '../../store/database';
import { ErrorResponse } from '../../utils/ErrorResponse';
import { encrypter, getToken } from '../../utils/utilities';

const Controller = (db: ExtendedProtocol) => {
  const some = async (req: Request) => {
    try {
      const rows = await db.users.find({ ...req.query, active: true });
      if (!rows) {
        throw new ErrorResponse(404, 'Data not found');
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const findById = async (req: Request) => {
    const _id = req.params.id;
    try {
      const rows = await db.users.find({ active: true, _id });
      if (!rows || rows.length === 0) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const create = async (req: Request) => {
    const { _id, password, ...user } = req.body;
    if (!user.email || !password) {
      throw new ErrorResponse(400, 'Please send the correct info');
    }
    const newUser = {
      ...user,
      password: await encrypter(password),
      active: true,
      roles_id: 1,
    };
    try {
      const row = await db.users.create(newUser);
      if (!row) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }

      return {
        token: getToken(row._id!, row.email!, row.roles_id!.toString()),
        id: row._id,
      };
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const updateById = async (req: Request) => {
    const id = req.params.id;
    const updatedData = { ...req.body };
    delete updatedData._id;
    delete updatedData.password;
    delete updatedData.active;
    delete updatedData.created_at;

    try {
      const rows = await db.users.update(updatedData, id);
      if (!rows) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const deleteById = async (req: Request) => {
    const _id = req.params.id;
    try {
      const user = await db.users.find({ active: true, _id });
      if (!user) {
        throw new ErrorResponse(404, 'Id Not Found');
      }

      const deleteUser = {
        active: false,
        updated_at: 'now()',
        email_e: user[0].email,
        email: null,
      };
      const rows = await db.users.update(deleteUser, _id);
      if (!rows) {
        throw new ErrorResponse(
          500,
          'Oops Something wrong, please try again later'
        );
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  return {
    some,
    findById,
    create,
    updateById,
    deleteById,
  };
};

export default Controller;
