import { addMessageToHistory } from '../modules/history.js';
import {
  addEnterSubmitListener,
  addRestartButtonListener,
} from '../modules/listeners.js';
import { getRandomMessage } from '../service/message.js';
import { loadFromLocalStorage } from '../modules/storage.js';
import { currentUser } from '../modules/user.js';

const messageInput = document.getElementById('message');
const messageContainer = document.querySelector('.message-list');

const scrollChatToBottom = () => {
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const renderMessages = () => {
  const messageHistory = loadFromLocalStorage('messageHistory') || [];
  messageContainer.innerHTML = '';

  messageHistory.forEach((msg) => {
    const bubble = document.createElement('div');

    bubble.classList.add(
      'message-bubble',
      msg.origin === 'user' ? 'left' : 'right'
    );
    bubble.innerHTML = `<p class="message">${msg.text}</p>`;

    messageContainer.appendChild(bubble);
  });
};

const handleSendMessage = () => {
  const message = messageInput.value.trim();
  if (!message) {
    return;
  }

  addMessageToHistory(message, 'user');
  renderMessages();

  setTimeout(async () => {
    const { message: botMessage } = await getRandomMessage();
    addMessageToHistory(botMessage, 'bot');
    renderMessages();
    scrollChatToBottom();
  }, 1000);

  messageInput.value = '';
  scrollChatToBottom();
};

const initialize = () => {
  if (!currentUser.cpf || !currentUser.email) {
    window.location.href = '../../index.html';
    return;
  }

  const chatInterface = document.querySelector('.chat-interface');
  chatInterface.classList.remove('hidden');

  renderMessages();

  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', handleSendMessage);

  addRestartButtonListener();
  addEnterSubmitListener(messageInput, handleSendMessage);

  window.addEventListener('load', () => {
    scrollChatToBottom();
  });
};

document.addEventListener('DOMContentLoaded', initialize);
