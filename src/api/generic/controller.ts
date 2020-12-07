import { Request } from 'express';
import { ExtendedProtocol } from '../../store/database';
import { ErrorResponse } from '../../utils/ErrorResponse';

const Controller = (db: ExtendedProtocol) => {
  const COLUMNS = ['_id', 'description'];
  const some = async (req: Request) => {
    const table = req.baseUrl.split('/')[2];

    try {
      const rows = await db.find(
        table,
        { ...req.query, active: true },
        COLUMNS
      );
      if (!rows) {
        throw new ErrorResponse(404, 'Data not found');
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const findById = async (req: Request) => {
    const table = req.baseUrl.split('/')[2];

    const _id = req.params.id;
    try {
      const rows = await db.find(table, { active: true, _id }, COLUMNS);
      if (!rows || rows.length === 0) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const create = async (req: Request) => {
    const table = req.baseUrl.split('/')[2];
    const { _id, ...data } = req.body;
    if (!data) {
      throw new ErrorResponse(400, 'Please send the correct info');
    }
    const newData = {
      ...data,
      active: true,
    };
    try {
      const row = await db.create(table, newData, COLUMNS);
      if (!row) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }

      return row;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const updateById = async (req: Request) => {
    const table = req.baseUrl.split('/')[2];
    const id = req.params.id;
    const updatedData = { ...req.body };
    delete updatedData._id;
    delete updatedData.active;
    delete updatedData.created_at;

    try {
      const row = await db.update(table, updatedData, id);
      if (!row) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }
      return row;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const deleteById = async (req: Request) => {
    const table = req.baseUrl.split('/')[2];
    const _id = req.params.id;
    try {
      const data = await db.find(table, { active: true, _id });
      if (!data) {
        throw new ErrorResponse(404, 'Id Not Found');
      }

      const deleteUser = {
        active: false,
        updated_at: 'now()',
        email_e: data.email,
        email: null,
      };
      const rows = await db.update(table, deleteUser, _id);
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
