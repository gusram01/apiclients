import { Request } from 'express';
import { ExtendedProtocol } from '../../store/database';
import { ErrorResponse } from '../../utils/ErrorResponse';

const Controller = (db: ExtendedProtocol) => {
  const some = async (req: Request) => {
    const users_id = req.user.id;
    try {
      const rows = await db.users_customers.customersByUser(users_id, {
        ...req.query,
        active: true,
      });
      if (!rows || rows.length === 0) {
        throw new ErrorResponse(404, 'Data not found');
      }

      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const findById = async (req: Request) => {
    const users_id = req.user.id;
    const _id = req.params.id;

    try {
      const rows = await db.users_customers.customersById(users_id, _id);
      if (!rows || rows.length === 0) {
        throw new ErrorResponse(404, `ID IS NOT CORRECT: \"${_id}\"`);
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const create = async (req: Request) => {
    const users_id = req.user.id;
    const { _id, ...customer } = req.body;

    const newCustomer = {
      ...customer,
      active: true,
    };
    try {
      const row = await db.customers.create(newCustomer);
      if (!row) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }

      await db.users_customers.create({
        users_id,
        customers_id: row._id,
      });

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
      const rows = await db.customers.update(updatedData, id);
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
      const customer = await db.customers.find({ active: true, _id });
      if (!customer) {
        throw new ErrorResponse(404, 'Id Not Found');
      }

      const deleteCustomer = {
        active: false,
        updated_at: 'now()',
        curp_e: customer[0].curp,
        curp: null,
      };
      const rows = await db.customers.update(deleteCustomer, _id);
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
