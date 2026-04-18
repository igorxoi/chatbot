import { history } from '../modules/history.js';
import { onboardingInputs } from '../modules/onboardingInputs.js';
import { listeners } from '../modules/listeners.js';
import { authService } from '../service/auth.js';
import { storage } from '../modules/storage.js';
import { user } from '../modules/user.js';

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
  onboardingInputs.hideAllInputs([cpfInput, emailInput, messageInput]);

  if (!user.get().cpf && !user.get().email) {
    onboardingInputs.showInput(cpfInput, initialMessageBanner, initialMessage);
  }

  if (user.get().cpf && !user.get().email) {
    onboardingInputs.showInput(
      emailInput,
      initialMessageBanner,
      'Agora nos informe o seu email.'
    );
  }

  if (user.get().cpf && user.get().email) {
    onboardingInputs.showInput(
      messageInput,
      initialMessageBanner,
      welcomeMessage
    );
  }
};

const handleSuccessLogin = (currentUser) => {
  user.set(currentUser);
  storage.save('user', currentUser);

  welcomeMessage = currentUser.name
    ? `Olá ${currentUser.name}, como podemos te ajudar hoje?`
    : 'Olá, como podemos te ajudar hoje?';
};

const handleErrorLogin = () => {
  user.set({ cpf: '', email: '' });

  initialMessage = 'Credenciais inválidas! Por favor, nos informe o seu CPF.';
  cpfInput.value = '';
  emailInput.value = '';
};

const updateUserFromInputs = () => {
  const storedUser = storage.load('user');
  user.set({
    cpf: cpfInput.value.trim() || (storedUser && storedUser.cpf) || null,
    email: emailInput.value.trim() || (storedUser && storedUser.email) || null,
  });
};

const authenticate = async () => {
  const currentUser = user.get();
  if (!currentUser.cpf || !currentUser.email) {
    return;
  }

  startLoading();

  try {
    const response = await authService.login(
      currentUser.cpf,
      currentUser.email
    );

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

  history.addMessage(message, 'user');
  messageInput.value = '';

  document.querySelector('.onboarding').classList.add('hidden');

  setTimeout(() => {
    window.location.href = 'src/pages/chatbot.html';
  }, 600);
};

const initialize = () => {
  const storedUser = storage.load('user');
  const messageHistory = storage.load('messageHistory') || [];

  if (storedUser) {
    welcomeMessage = storedUser.name
      ? `Olá ${storedUser.name}, como podemos te ajudar hoje?`
      : 'Olá, como podemos te ajudar hoje?';

    user.set(storedUser);
  }

  const onboarding = document.querySelector('.onboarding');
  onboarding.classList.remove('hidden');

  if (messageHistory.length > 0) {
    window.location.href = 'src/pages/chatbot.html';
  } else {
    onboarding.classList.remove('hide');
    onboardingInputs.hideAllInputs([cpfInput, emailInput, messageInput]);
    checkStepState();
  }

  const submitButton = document.getElementById('submit-button');
  submitButton.addEventListener('click', handleSendMessage);

  listeners.addRestartButton();
  [cpfInput, emailInput, messageInput].forEach((input) =>
    listeners.addEnterSubmit(input, handleSendMessage)
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
