export const saveToLocalStorage = (name, user) => {
  localStorage.setItem(name, JSON.stringify(user));
};

export const loadFromLocalStorage = (name) => {
  const storedItem = localStorage.getItem(name);
  return storedItem ? JSON.parse(storedItem) : null;
};

export const resetLocalStorage = () => {
  localStorage.clear();
  window.location.href = "/index.html";
};