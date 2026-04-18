import { index } from '../modules/index.js';
import { listeners } from '../modules/listeners.js';

const cpfInput = document.getElementById('cpf');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const initialMessageBanner = document.querySelector('.initial-message');
const loading = document.querySelector('.loading');
const messageBubble = document.querySelector('.message-bubble');
const chatInputArea = document.querySelector('.chat-input-area');
const submitButton = document.getElementById('submit-button');
const onboarding = document.querySelector('.onboarding');

const initialize = () => {
  index.setup({
    submitButton,
    cpfInput,
    emailInput,
    messageInput,
    initialMessageBanner,
    loading,
    messageBubble,
    chatInputArea,
    onboarding,
  });
  index.initialize();

  submitButton.addEventListener('click', index.handleSendMessage);

  listeners.setup({ onEnterSubmit: index.handleSendMessage });
  listeners.addRestartButton();

  [cpfInput, emailInput, messageInput].forEach((input) =>
    listeners.addEnterSubmit(input)
  );
};

document.addEventListener('DOMContentLoaded', initialize);
