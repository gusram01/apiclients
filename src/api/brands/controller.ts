import { Request } from 'express';
import { ExtendedProtocol } from '../../store/database';
import { ErrorResponse } from '../../utils/ErrorResponse';

const Controller = (db: ExtendedProtocol) => {
  const some = async (req: Request) => {
    try {
      const rows = await db.brands.find({ ...req.query, active: true });
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
      const rows = await db.brands.find({ active: true, _id });
      if (!rows || rows.length === 0) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const create = async (req: Request) => {
    const { _id, ...data } = req.body;
    if (!data) {
      throw new ErrorResponse(400, 'Please send the correct info');
    }
    const newData = {
      ...data,
      active: true,
    };
    try {
      const row = await db.brands.create(newData);
      if (!row) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }

      return row;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const updateById = async (req: Request) => {
    const id = req.params.id;
    const updatedData = { ...req.body };
    delete updatedData._id;
    delete updatedData.active;
    delete updatedData.created_at;

    try {
      const row = await db.brands.update(updatedData, id);
      if (!row) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }
      return row;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const deleteById = async (req: Request) => {
    const _id = req.params.id;
    try {
      const data = await db.brands.find({ active: true, _id });
      if (!data) {
        throw new ErrorResponse(404, 'Id Not Found');
      }

      const deleteUser = {
        active: false,
        updated_at: 'now()',
      };
      const rows = await db.brands.update(deleteUser, _id);
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
