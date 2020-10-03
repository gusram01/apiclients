import './styles.css';
import { clickListener, submitListener } from './globalListener';

const body = document.getElementById('global') as HTMLBodyElement;
const form = document.getElementById('form__index') as HTMLFormElement;

body.addEventListener('click', clickListener);
form.addEventListener('submit', submitListener);
