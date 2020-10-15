import { IStore } from '../../../store/interfaces/store';
import { Users } from './users.interface';

const Controller = (store: IStore) => {
  const getAll = () => store.getAll();
  const getOne = (id: string) => store.getOne(id);
  const newUser = (user: Users) => store.newUser(user);
  const updateUser = (id: string, user: Users) => store.updateUser(id, user);
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
