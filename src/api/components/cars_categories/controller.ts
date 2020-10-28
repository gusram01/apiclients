import { IStore } from '../../../store/interfaces/store';

const Controller = (store: IStore) => {
  const table = 'cars_categories';
  const getAll = () => store.getAll(table);
  const getOne = (id: string) => store.getOne(table, id);
  const newOne = (data: any) => store.newOne(table, data);
  const updateOne = (id: string, user: any) => store.updateOne(table, id, user);
  const delOne = (id: string) => store.delOne(table, id);

  return {
    getAll,
    getOne,
    newOne,
    updateOne,
    delOne,
  };
};

export default Controller;
