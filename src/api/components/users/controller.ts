import { IStore } from '../../../store/interfaces/store';
import { Users } from './users.interface';

const Controller = (store: IStore) => {
  const getAll = () => store.getAll();
  const getOne = (id: string) => store.getOne(id);
  const postOne = (user: Users) => store.postOne(user);
  const updateOne = (id: string, user: Users) => store.updateOne(id, user);
  const delOne = (id: string) => store.delOne(id);

  return {
    getAll,
    getOne,
    postOne,
    updateOne,
    delOne,
  };
};

export default Controller;
