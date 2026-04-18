import { history } from './history.js';
import { messageInfo } from './messageInfo.js';
import { messageService } from '../service/message.js';

let messageInput;
let messageContainer;
let chatLoading;
let submitButton;

const setup = (elements) => {
  messageInput = elements.messageInput;
  messageContainer = elements.messageContainer;
  chatLoading = elements.chatLoading;
  submitButton = elements.submitButton;
};

const scrollToBottom = () => {
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

const setLoading = (isLoading) => {
  chatLoading.classList.toggle('active', isLoading);
  messageInput.disabled = isLoading;
  submitButton.disabled = isLoading;

  setTimeout(scrollToBottom, 0);
};

const renderMessages = () => {
  const messageHistory = history.list();
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

const refreshChat = () => {
  renderMessages();
  scrollToBottom();
};

const queueBotReply = () => {
  setLoading(true);

  setTimeout(async () => {
    try {
      const { message: botMessage } = await messageService.getRandomMessage();
      history.addMessage(botMessage, 'bot');
      refreshChat();
    } finally {
      setLoading(false);
    }
  }, 1000);
};

const handleSendMessage = () => {
  if (chatLoading.classList.contains('active')) {
    return;
  }

  const message = messageInput.value.trim();
  if (!message) {
    return;
  }

  history.addMessage(message, 'user');
  messageInput.value = '';

  refreshChat();
  queueBotReply();
};

const loadInitialBotMessage = () => {
  if (history.hasPendingReply()) {
    queueBotReply();
  }
};

export const chat = {
  setup,
  handleSendMessage,
  loadInitialBotMessage,
  refreshChat,
  scrollToBottom,
};