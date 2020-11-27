import { Request } from 'express';
import { IStore } from '../store/interfaces/store';

const Controller = (store: IStore) => {
  const getAll = (req: Request) => store.getAll(req);
  const getOne = (req: Request) => store.getOne(req);
  const newOne = (req: Request) => store.newOne(req);
  const updateOne = (req: Request) => store.updateOne(req);
  const delOne = (req: Request) => store.delOne(req);
  const getSome = (req: Request) => store.getSome(req);

  return {
    getAll,
    getOne,
    newOne,
    updateOne,
    delOne,
    getSome,
  };
};

export default Controller;
