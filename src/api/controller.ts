import { IStore } from '../store/interfaces/store';

const Controller = (store: IStore) => {
  const getAll = (table: string) => store.getAll(table);
  const getOne = (table: string, id: string) => store.getOne(table, id);
  const newOne = (table: string, data: any) => store.newOne(table, data);
  const updateOne = (table: string, id: string, user: any) =>
    store.updateOne(table, id, user);
  const delOne = (table: string, id: string) => store.delOne(table, id);
  const getSome = (table: string, data: any) => store.getSome(table, data);

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
