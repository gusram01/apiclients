import { store } from '../../../store/store';
import Controller from './controller';

const userStore = store('users');

export default Controller(userStore);
