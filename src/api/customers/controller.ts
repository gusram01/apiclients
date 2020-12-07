import { Request } from 'express';
import { ExtendedProtocol } from '../../store/database';
import { ErrorResponse } from '../../utils/ErrorResponse';

const Controller = (db: ExtendedProtocol) => {
  const table = 'customers';

  const some = async (req: Request) => {
    try {
      const rows = await db.find(table, { ...req.query, active: true });
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
      const rows = await db.find(table, { active: true, _id });
      if (!rows || rows.length === 0) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const create = async (req: Request) => {
    const { _id, ...customer } = req.body;
    if (
      !customer.firstname &&
      !customer.lastname &&
      !customer.curp &&
      !customer.mobile &&
      !customer.gender
    ) {
      throw new ErrorResponse(400, 'Please send the correct info');
    }
    const newCustomer = {
      ...customer,
      active: true,
    };
    try {
      const row = await db.create(table, newCustomer, [
        '_id',
        'firstname',
        'lastname',
        'curp',
        'gender',
      ]);
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
      const rows = await db.update(table, updatedData, id);
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
      const customer = await db.find(table, { active: true, _id });
      if (!customer) {
        throw new ErrorResponse(404, 'Id Not Found');
      }

      const deleteCustomer = {
        active: false,
        updated_at: 'now()',
        curp_e: customer.curp,
        curp: null,
      };
      const rows = await db.update(table, deleteCustomer, _id);
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
