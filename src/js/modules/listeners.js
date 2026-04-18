import { storage } from './storage.js';

let enterSubmitCallback;

const setup = ({ onEnterSubmit } = {}) => {
  enterSubmitCallback = onEnterSubmit;
};

const addRestartButton = () => {
  const restartButton = document.getElementById('restart-button');
  restartButton.addEventListener('click', () => storage.reset());
};

const addEnterSubmit = (inputElement, callback = enterSubmitCallback) => {
  if (!callback) {
    return;
  }

  inputElement.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      callback();
    }
  });
};

export const listeners = { setup, addRestartButton, addEnterSubmit };
