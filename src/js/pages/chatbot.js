import { chat } from '../modules/chat.js';
import { listeners } from '../modules/listeners.js';
import { storage } from '../modules/storage.js';
import { user } from '../modules/user.js';

const messageInput = document.getElementById('message');
const messageContainer = document.querySelector('.message-list');
const chatLoading = document.querySelector('.chat-loading');
const submitButton = document.getElementById('submit-button');
const chatInterface = document.querySelector('.chat-interface');

const initialize = () => {
  user.set(storage.load('user'));

  if (!user.get().cpf || !user.get().email) {
    window.location.href = '../../index.html';
    return;
  }

  chatInterface.classList.remove('hidden');

  chat.setup({
    messageInput,
    messageContainer,
    chatLoading,
    submitButton,
  });

  chat.refreshChat();
  chat.loadInitialBotMessage();

  submitButton.addEventListener('click', chat.handleSendMessage);

  listeners.setup({ onEnterSubmit: chat.handleSendMessage });
  listeners.addRestartButton();
  listeners.addEnterSubmit(messageInput);

  window.addEventListener('load', () => {
    chat.scrollToBottom();
  });
};

document.addEventListener('DOMContentLoaded', initialize);
