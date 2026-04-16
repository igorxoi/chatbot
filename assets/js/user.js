export let currentUser = {
  cpf: "",
  email: "",
};

export const setUser = (user) => {
  currentUser = user;
};