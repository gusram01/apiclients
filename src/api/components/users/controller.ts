import { IStore } from '../../../store/interfaces/store';

const Controller = (store: IStore) => {
  const getAll = () => store.getAll();
  const getOne = (id: string) => store.getOne(id);
  const newUser = (user: any) => store.newUser(user);
  const updateUser = (id: string, user: any) => store.updateUser(id, user);
  const delUser = (id: string) => store.delUser(id);
  const findId = (id: string) => store.findId(id);

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
