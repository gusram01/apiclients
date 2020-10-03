const formContainer = document.getElementById(
  'modal__container'
) as HTMLDivElement;
const itemPass = document.getElementById('item-password') as HTMLDivElement;
const itemVerify = document.getElementById('item-verify') as HTMLDivElement;
const buttonLogin = document.getElementById('form-button') as HTMLButtonElement;

const clickListener = (e: Event) => {
  const element = e.target as HTMLElement;

  if (element.matches('.link')) {
    e.preventDefault();
  }
  if (element.id === 'button-signup') {
    formContainer.classList.toggle('show');
  }
  if (element.id === 'modal__container') {
    formContainer.classList.toggle('show');
    itemPass.classList.remove('hide');
    itemVerify.classList.remove('hide');
    buttonLogin.textContent = 'Sign Up';
  }
  if (element.id === 'forgot') {
    itemPass.classList.add('hide');
    itemVerify.classList.add('hide');
    buttonLogin.textContent = 'New Password';
  }
  if (element.id === 'login') {
    itemPass.classList.remove('hide');
    itemVerify.classList.add('hide');
    buttonLogin.textContent = 'Log In';
  }
};

const submitListener = (e: Event) => {
  e.preventDefault();
};

export { clickListener, submitListener };
