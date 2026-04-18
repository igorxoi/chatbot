const save = (name, value) => {
  localStorage.setItem(name, JSON.stringify(value));
};

const load = (name) => {
  const storedItem = localStorage.getItem(name);
  return storedItem ? JSON.parse(storedItem) : null;
};

const reset = () => {
  localStorage.clear();
  window.location.href = '/index.html';
};

export const storage = { save, load, reset };
