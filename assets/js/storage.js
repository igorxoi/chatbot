export const saveToLocalStorage = (name, user) => {
  localStorage.setItem(name, JSON.stringify(user));
};

export const loadFromLocalStorage = (name) => {
  const storedItem = localStorage.getItem(name);
  return storedItem ? JSON.parse(storedItem) : null;
};

export const resetLocalStorage = (name) => {
  localStorage.removeItem(name);
  location.reload();
};