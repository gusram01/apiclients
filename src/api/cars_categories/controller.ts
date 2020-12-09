import { Request } from 'express';
import { ExtendedProtocol } from '../../store/database';
import { ErrorResponse } from '../../utils/ErrorResponse';

const Controller = (db: ExtendedProtocol) => {
  const table = 'cars_categories';

  const some = async (req: Request) => {
    const data = { ...req.query } as any;
    console.log(data);
    try {
      const rows = await db.cars_categories.find(data);
      if (!rows || rows.length === 0) {
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
      const rows = await db.cars_categories.findById(_id);
      if (!rows) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const create = async (req: Request) => {
    const { _id, ...cars_category } = req.body;

    try {
      const row = await db.create(table, cars_category);
      if (!row) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }

      return row;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const updateById = async (req: Request) => {
    const _id = req.params.id;
    const updatedData = { ...req.body };

    try {
      const cars_category = await db.cars_categories.findById(_id);
      if (!cars_category) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }

      const rows = await db.update(table, updatedData, _id);
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
      const cars_category = await db.cars_categories.findById(_id);
      if (!cars_category) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }

      const row = await db.cars_categories.deleteById(_id);
      if (!row) {
        throw new ErrorResponse(
          500,
          'Oops Something wrong, please try again later'
        );
      }
      return row;
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
