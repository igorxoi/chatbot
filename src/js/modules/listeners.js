import { storage } from './storage.js';

const addRestartButton = () => {
  const restartButton = document.getElementById('restart-button');
  restartButton.addEventListener('click', () => storage.reset());
};

const addEnterSubmit = (inputElement, callback) => {
  inputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      callback();
    }
  });
};

export const listeners = { addRestartButton, addEnterSubmit };
