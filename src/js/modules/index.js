import { authService } from '../service/auth.js';
import { history } from './history.js';
import { onboardingInputs } from './onboardingInputs.js';
import { storage } from './storage.js';
import { user } from './user.js';

let submitButton;
let cpfInput;
let emailInput;
let messageInput;
let initialMessageBanner;
let loading;
let messageBubble;
let chatInputArea;
let onboarding;

let initialMessage = 'Olá, antes de iniciar nos informe o seu CPF.';
let welcomeMessage = 'Olá, como podemos te ajudar hoje?';

const setup = (elements) => {
  submitButton = elements.submitButton;
  cpfInput = elements.cpfInput;
  emailInput = elements.emailInput;
  messageInput = elements.messageInput;
  initialMessageBanner = elements.initialMessageBanner;
  loading = elements.loading;
  messageBubble = elements.messageBubble;
  chatInputArea = elements.chatInputArea;
  onboarding = elements.onboarding;

  onboardingInputs.setup({
    inputs: [cpfInput, emailInput, messageInput],
    messageBanner: initialMessageBanner,
  });
};

const setLoading = (isLoading) => {
  messageBubble.classList.toggle('hide', isLoading);
  chatInputArea.classList.toggle('hide', isLoading);
  loading.classList.toggle('active', isLoading);

  messageInput.disabled = isLoading;

  if (submitButton) {
    submitButton.disabled = isLoading;
  }
};

const checkStepState = () => {
  onboardingInputs.hideAllInputs();

  if (!user.get().cpf && !user.get().email) {
    onboardingInputs.showInput(cpfInput, initialMessage);
  }

  if (user.get().cpf && !user.get().email) {
    onboardingInputs.showInput(emailInput, 'Agora nos informe o seu email.');
  }

  if (user.get().cpf && user.get().email) {
    onboardingInputs.showInput(messageInput, welcomeMessage);
  }
};

const handleSuccessLogin = (currentUser) => {
  user.set(currentUser);
  storage.save('user', currentUser);

  welcomeMessage = currentUser.name
    ? `Olá ${currentUser.name}, como podemos te ajudar hoje?`
    : 'Olá, como podemos te ajudar hoje?';
};

const handleErrorLogin = (message = null) => {
  user.set({ cpf: '', email: '' });

  initialMessage =
    message || 'Credenciais inválidas! Por favor, nos informe o seu CPF.';
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

const handleAuthenticationRequest = async (currentUser) => {
  try {
    const response = await authService.login(currentUser.cpf, currentUser.email);

    if (response.success) {
      handleSuccessLogin(response.user);
      return;
    }

    handleErrorLogin(response.message);
  } catch (error) {
    const message = error.message ? error.message : 'Tivemos um problema.';
    handleErrorLogin(message);
  }
};

const authenticate = async () => {
  updateUserFromInputs();

  const currentUser = user.get();
  if (!currentUser.cpf || !currentUser.email) {
    return;
  }

  setLoading(true);

  try {
    await handleAuthenticationRequest(currentUser);
  } finally {
    setLoading(false);
    checkStepState();
  }
};

const handleSendMessage = () => {
  authenticate();

  const message = messageInput.value.trim();
  if (!message) {
    checkStepState();
    return;
  }

  history.addMessage(message, 'user');
  messageInput.value = '';

  onboarding.classList.add('hidden');

  setTimeout(() => {
    window.location.href = 'src/pages/chatbot.html';
  }, 600);
};

const initialize = () => {
  const storedUser = storage.load('user');
  const messageHistory = history.list();

  if (storedUser) {
    welcomeMessage = storedUser.name
      ? `Olá ${storedUser.name}, como podemos te ajudar hoje?`
      : 'Olá, como podemos te ajudar hoje?';

    user.set(storedUser);
  }

  onboarding.classList.remove('hidden');

  if (messageHistory.length > 0) {
    window.location.href = 'src/pages/chatbot.html';
    return;
  }

  onboarding.classList.remove('hide');
  onboardingInputs.hideAllInputs();
  checkStepState();
};

export const index = { setup, handleSendMessage, initialize };