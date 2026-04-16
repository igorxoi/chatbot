import { addMessageToHistory } from "./chat.js";
import { hideAllInputs, showInput } from "./handle.js";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  resetLocalStorage,
} from "./storage.js";
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
  const storedUser = loadFromLocalStorage('user');

  setUser({
    cpf: cpfInput.value.trim() || (storedUser && storedUser.cpf) || null,
    email: emailInput.value.trim() || (storedUser && storedUser.email) || null,
  });

  saveToLocalStorage("user", currentUser);
};


const handleSendMessage = () => {
  updateUserFromInputs();
  const message = messageInput.value.trim();

  if (message) {
    const wasFirstMessage = (loadFromLocalStorage("messageHistory") || []).length === 0;
    
    addMessageToHistory(message);
    messageInput.value = "";

    if (wasFirstMessage) {
      document.querySelector(".onboarding").classList.add("hidden");
      document.querySelector(".chat-interface").classList.remove("hidden");
    }
  }

  checkStepState();
};

const initialize = () => {
  const storedUser = loadFromLocalStorage('user');
  const messageHistory = loadFromLocalStorage('messageHistory') || [];
  
  if (storedUser) {
    setUser(storedUser);
  }

  const onboarding = document.querySelector(".onboarding");
  onboarding.classList.remove("hidden");

  if (messageHistory.length > 0) {
    // window.location.href = "pages/chat.html";
  } else {
    onboarding.classList.remove("hide");
    hideAllInputs([cpfInput, emailInput, messageInput]);
    checkStepState();
  }

  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", handleSendMessage);

  const addEnterSubmitListener = (inputElement) => {
    inputElement.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    });
  };

  [cpfInput, emailInput, messageInput].forEach(addEnterSubmitListener);

  const restartButton = document.getElementById("restart-button");
  if (restartButton) {
    restartButton.addEventListener("click", () => resetLocalStorage('user'));
  }
};

document.addEventListener("DOMContentLoaded", initialize);
