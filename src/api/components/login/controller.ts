import { IStore } from '../../../store/interfaces/store';

const Controller = (store: IStore) => {
  const login = (data: any) => store.login(data);

  return {
    login,
  };
};

export default Controller;
