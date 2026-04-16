import { addMessageToHistory } from "./chat.js";
import { hideAllInputs, showInput } from "./handle.js";
import { addEnterSubmitListener, addRestartButtonListener } from "./listeners.js";
import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";
import { currentUser, setUser } from "./user.js";

const cpfInput = document.getElementById("cpf");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const messageBanner = document.querySelector(".initial-message");

const checkStepState = () => {
  hideAllInputs([cpfInput, emailInput, messageInput]);

  if (!currentUser.cpf && !currentUser.email) {
    showInput(
      cpfInput,
      messageBanner,
      "Olá, antes de iniciar nos informe o seu CPF.",
    );
  }

  if (currentUser.cpf && !currentUser.email) {
    showInput(emailInput, messageBanner, "Agora nos informe o seu email.");
  }

  if (currentUser.cpf && currentUser.email) {
    showInput(messageInput, messageBanner, "Olá, como podemos te ajudar hoje?");
  }
};

const updateUserFromInputs = () => {
  const storedUser = loadFromLocalStorage("user");

  setUser({
    cpf: cpfInput.value.trim() || (storedUser && storedUser.cpf) || null,
    email: emailInput.value.trim() || (storedUser && storedUser.email) || null,
  });

  saveToLocalStorage("user", currentUser);
};

const handleSendMessage = () => {
  updateUserFromInputs();
  const message = messageInput.value.trim();

  if (!message) {
    checkStepState();
    return;
  }

  addMessageToHistory(message, "user");
  messageInput.value = "";

  document.querySelector(".onboarding").classList.add("hidden");

  setTimeout(() => {
    window.location.href = "pages/chatbot.html";
  }, 600);
};

const initialize = () => {
  const storedUser = loadFromLocalStorage("user");
  const messageHistory = loadFromLocalStorage("messageHistory") || [];

  if (storedUser) {
    setUser(storedUser);
  }

  const onboarding = document.querySelector(".onboarding");
  onboarding.classList.remove("hidden");

  if (messageHistory.length > 0) {
    window.location.href = "pages/chatbot.html";
  } else {
    onboarding.classList.remove("hide");
    hideAllInputs([cpfInput, emailInput, messageInput]);
    checkStepState();
  }

  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", handleSendMessage);

  addRestartButtonListener();

  [cpfInput, emailInput, messageInput].forEach((input) => addEnterSubmitListener(input, handleSendMessage));
};

document.addEventListener("DOMContentLoaded", initialize);
