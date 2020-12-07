import { Request } from 'express';
import { ExtendedProtocol } from '../../store/database';
import { ErrorResponse } from '../../utils/ErrorResponse';

const Controller = (db: ExtendedProtocol) => {
  const table = 'cars';

  const some = async (req: Request) => {
    try {
      const rows = await db.findCar({ ...req.query, active: true });
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
      const rows = await db.findCarById(_id);
      if (!rows) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const create = async (req: Request) => {
    const { _id, description, ...car } = req.body;
    const newCar = {
      ...car,
      active: true,
      description: `${car.brands_id.toUpperCase()} ${car.models_id.toUpperCase()} ${car.versions_id.toUpperCase()}`,
    };

    try {
      const row = await db.create(table, newCar);
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

    try {
      const car = await db.find(table, { active: true, _id });
      if (!car) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }
      const updatedData = { ...req.body };
      delete updatedData._id;
      delete updatedData.active;
      delete updatedData.created_at;
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
      const car = await db.find(table, { active: true, _id });
      if (!car) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }

      const deleteCar = {
        active: false,
        updated_at: 'now()',
        email_e: car.email,
        email: null,
      };
      const rows = await db.update(table, deleteCar, _id);
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
