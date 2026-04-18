import { addMessageToHistory } from '../modules/history.js';
import { hideAllInputs, showInput } from '../modules/handle.js';
import {
  addEnterSubmitListener,
  addRestartButtonListener,
} from '../modules/listeners.js';
import { login } from '../service/auth.js';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from '../modules/storage.js';
import { currentUser, setUser } from '../modules/user.js';

const cpfInput = document.getElementById('cpf');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const initialMessageBanner = document.querySelector('.initial-message');
const loading = document.querySelector('.loading');
const messageBubble = document.querySelector('.message-bubble');
const chatInputArea = document.querySelector('.chat-input-area');

let initialMessage = 'Olá, antes de iniciar nos informe o seu CPF.';
let welcomeMessage = 'Olá, como podemos te ajudar hoje?';

const checkStepState = () => {
  hideAllInputs([cpfInput, emailInput, messageInput]);

  if (!currentUser.cpf && !currentUser.email) {
    showInput(cpfInput, initialMessageBanner, initialMessage);
  }

  if (currentUser.cpf && !currentUser.email) {
    showInput(
      emailInput,
      initialMessageBanner,
      'Agora nos informe o seu email.'
    );
  }

  if (currentUser.cpf && currentUser.email) {
    showInput(messageInput, initialMessageBanner, welcomeMessage);
  }
};

const handleSuccessLogin = (user) => {
  setUser(user);
  saveToLocalStorage('user', user);

  welcomeMessage = user.name
    ? `Olá ${user.name}, como podemos te ajudar hoje?`
    : 'Olá, como podemos te ajudar hoje?';
};

const handleErrorLogin = () => {
  setUser({ cpf: '', email: '' });

  initialMessage = 'Credenciais inválidas! Por favor, nos informe o seu CPF.';
  cpfInput.value = '';
  emailInput.value = '';
};

const updateUserFromInputs = () => {
  const storedUser = loadFromLocalStorage('user');
  setUser({
    cpf: cpfInput.value.trim() || (storedUser && storedUser.cpf) || null,
    email: emailInput.value.trim() || (storedUser && storedUser.email) || null,
  });
};

const authenticate = async () => {
  if (!currentUser.cpf || !currentUser.email) {
    return;
  }

  startLoading();

  try {
    const response = await login(currentUser.cpf, currentUser.email);
    if (response.success) {
      handleSuccessLogin(response.user);
      return;
    }

    handleErrorLogin();
  } catch (error) {
    welcomeMessage = error.message ? error.message : 'Tivemos um problema.';
  } finally {
    stopLoading();
    checkStepState();
  }
};

const handleSendMessage = () => {
  updateUserFromInputs();
  authenticate();

  const message = messageInput.value.trim();
  if (!message) {
    checkStepState();
    return;
  }

  addMessageToHistory(message, 'user');
  messageInput.value = '';

  document.querySelector('.onboarding').classList.add('hidden');
  setTimeout(() => {
    window.location.href = 'src/pages/chatbot.html';
  }, 600);
};

const initialize = () => {
  const storedUser = loadFromLocalStorage('user');
  const messageHistory = loadFromLocalStorage('messageHistory') || [];

  if (storedUser) {
    welcomeMessage = storedUser.name
      ? `Olá ${storedUser.name}, como podemos te ajudar hoje?`
      : 'Olá, como podemos te ajudar hoje?';
    setUser(storedUser);
  }

  const onboarding = document.querySelector('.onboarding');
  onboarding.classList.remove('hidden');

  if (messageHistory.length > 0) {
    window.location.href = 'src/pages/chatbot.html';
  } else {
    onboarding.classList.remove('hide');
    hideAllInputs([cpfInput, emailInput, messageInput]);
    checkStepState();
  }

  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', handleSendMessage);

  addRestartButtonListener();
  [cpfInput, emailInput, messageInput].forEach((input) =>
    addEnterSubmitListener(input, handleSendMessage)
  );
};

function startLoading() {
  messageBubble.classList.add('hide');
  chatInputArea.classList.add('hide');
  loading.classList.add('active');
}

function stopLoading() {
  messageBubble.classList.remove('hide');
  chatInputArea.classList.remove('hide');
  loading.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', initialize);
