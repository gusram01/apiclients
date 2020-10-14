import { dbMethods } from '../../../store/store';
import User from '../../../store/models/users';
import Controller from './controller';

const userStore = dbMethods(User);

export default Controller(userStore);
