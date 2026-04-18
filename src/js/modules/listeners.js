import { resetLocalStorage } from './storage.js';

export const addRestartButtonListener = () => {
  const restartButton = document.getElementById('restart-button');
  restartButton.addEventListener('click', () => resetLocalStorage());
};

export const addEnterSubmitListener = (inputElement, callback) => {
  inputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      callback();
    }
  });
};
