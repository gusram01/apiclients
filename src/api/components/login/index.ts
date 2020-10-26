import { db } from '../../../store/store';
import Controller from './controller';

const userStore = db('users');

export default Controller(userStore);
