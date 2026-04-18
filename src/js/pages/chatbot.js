import { history } from '../modules/history.js';
import { listeners } from '../modules/listeners.js';
import { messageInfo } from '../modules/messageInfo.js';
import { messageService } from '../service/message.js';
import { storage } from '../modules/storage.js';
import { user } from '../modules/user.js';

const messageInput = document.getElementById('message');
const messageContainer = document.querySelector('.message-list');
const chatLoading = document.querySelector('.chat-loading');

const setBotLoading = (isLoading) => {
  chatLoading.classList.toggle('active', isLoading);
  setTimeout(scrollChatToBottom, 0);
};

const scrollChatToBottom = () => {
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const renderMessages = () => {
  const messageHistory = storage.load('messageHistory') || [];
  messageContainer.innerHTML = '';
  let previousMessageDay = '';

  messageHistory.forEach((msg) => {
    const currentMessageDay = messageInfo.formatDay(msg.timestamp);
    const bubble = document.createElement('div');
    const author = document.createElement('span');
    const text = document.createElement('p');
    const time = document.createElement('span');

    if (currentMessageDay && currentMessageDay !== previousMessageDay) {
      const daySeparator = document.createElement('div');
      daySeparator.classList.add('message-day');
      daySeparator.textContent = currentMessageDay;
      messageContainer.appendChild(daySeparator);
      previousMessageDay = currentMessageDay;
    }

    bubble.classList.add(
      'message-bubble',
      msg.origin === 'user' ? 'left' : 'right'
    );

    author.classList.add('message-author');
    author.textContent = messageInfo.getAuthor(msg);

    text.classList.add('message');
    text.textContent = msg.text;

    time.classList.add('message-time');
    time.textContent = messageInfo.formatTime(msg.timestamp);

    bubble.appendChild(author);
    bubble.appendChild(text);
    bubble.appendChild(time);

    messageContainer.appendChild(bubble);
  });
};

const queueBotReply = () => {
  setBotLoading(true);

  setTimeout(async () => {
    try {
      const { message: botMessage } = await messageService.getRandomMessage();
      history.addMessage(botMessage, 'bot');
      renderMessages();
      scrollChatToBottom();
    } finally {
      setBotLoading(false);
    }
  }, 1000);
};

const handleSendMessage = () => {
  const message = messageInput.value.trim();
  if (!message) {
    return;
  }

  history.addMessage(message, 'user');
  renderMessages();
  scrollChatToBottom();

  messageInput.value = '';

  queueBotReply();
};

const loadInitialBotMessage = async () => {
  const history = storage.load('messageHistory') || [];
  const lastMessage = history[history.length - 1];

  if (history.length > 0 && lastMessage?.origin === 'user') {
    queueBotReply();
  }
};

const initialize = () => {
  user.set(storage.load('user'));

  if (!user.get().cpf || !user.get().email) {
    window.location.href = '../../index.html';
    return;
  }

  const chatInterface = document.querySelector('.chat-interface');
  chatInterface.classList.remove('hidden');

  renderMessages();
  loadInitialBotMessage();

  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', handleSendMessage);

  listeners.addRestartButton();
  listeners.addEnterSubmit(messageInput, handleSendMessage);

  window.addEventListener('load', () => {
    scrollChatToBottom();
  });
};

document.addEventListener('DOMContentLoaded', initialize);
