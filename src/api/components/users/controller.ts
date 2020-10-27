import { IStore } from '../../../store/interfaces/store';

const Controller = (store: IStore) => {
  const table = 'users';
  const getAll = () => store.getAll(table);
  const getOne = (id: string) => store.getOne(table, id);
  const newUser = (user: any) => store.newUser(table, user);
  const updateUser = (id: string, user: any) =>
    store.updateUser(table, id, user);
  const delUser = (id: string) => store.delUser(table, id);
  const findId = (id: string) => store.findId(table, id);

  return {
    getAll,
    getOne,
    newUser,
    updateUser,
    delUser,
    findId,
  };
};

export default Controller;
