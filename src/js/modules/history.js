import { storage } from './storage.js';
import { user } from './user.js';

export const addMessage = (message, origin) => {
  const messageHistory = storage.load('messageHistory') || [];

  const messageEntry = {
    user: user.get(),
    origin: origin,
    text: message,
    timestamp: new Date().toISOString(),
  };

  messageHistory.push(messageEntry);
  storage.save('messageHistory', messageHistory);
};

export const history = { addMessage };
