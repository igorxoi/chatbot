let currentUser = {
  cpf: '',
  email: '',
};

const set = (value) => {
  currentUser = value;
};

const get = () => currentUser;

export const user = { get, set };
