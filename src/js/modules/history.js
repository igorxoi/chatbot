import { storage } from './storage.js';
import { user } from './user.js';

const list = () => storage.load('messageHistory') || [];

const getLast = () => {
  const messageHistory = list();
  return messageHistory[messageHistory.length - 1] || null;
};

const hasPendingReply = () => {
  const lastMessage = getLast();
  return list().length > 0 && lastMessage?.origin === 'user';
};

export const addMessage = (message, origin) => {
  const messageHistory = list();

  const messageEntry = {
    user: user.get(),
    origin: origin,
    text: message,
    timestamp: new Date().toISOString(),
  };

  messageHistory.push(messageEntry);
  storage.save('messageHistory', messageHistory);
};

export const history = { addMessage, list, getLast, hasPendingReply };
