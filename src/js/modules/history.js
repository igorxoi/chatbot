import { loadFromLocalStorage, saveToLocalStorage } from './storage.js';
import { currentUser } from './user.js';

export const addMessageToHistory = (message, origin) => {
  const messageHistory = loadFromLocalStorage('messageHistory') || [];

  const messageEntry = {
    user: currentUser,
    origin: origin,
    text: message,
    timestamp: new Date().toISOString(),
  };

  messageHistory.push(messageEntry);
  saveToLocalStorage('messageHistory', messageHistory);
};
