import { IStore } from '../../../store/interfaces/store';

const Controller = (store: IStore) => {
  const table = 'users';
  const login = (data: any) => store.login(table, data);

  return {
    login,
  };
};

export default Controller;
