const cpfInput = document.getElementById("cpf");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const messageBanner = document.querySelector(".initial-message");

let currentUser = {
  cpf: "",
  email: "",
};

const saveUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const loadUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

const hideAllInputs = () => {
  cpfInput.classList.add("hide");
  emailInput.classList.add("hide");
  messageInput.classList.add("hide");
};

const showCpfInput = () => {
  cpfInput.classList.remove("hide");
  messageBanner.textContent = "Olá, antes de iniciar nos informe o seu CPF.";
};

const showEmailInput = () => {
  emailInput.classList.remove("hide");
  messageBanner.textContent = "Agora nos informe o seu email.";
};

const showMessageInput = () => {
  messageInput.classList.remove("hide");
  messageBanner.textContent = "Olá, como podemos te ajudar hoje?";
};

const checkStepState = () => {
  hideAllInputs();

  if (!currentUser.cpf && !currentUser.email) {
    showCpfInput();
    return;
  }

  if (currentUser.cpf && !currentUser.email) {
    showEmailInput();
    return;
  }

  if (currentUser.cpf && currentUser.email) {
    showMessageInput();
  }
};

const updateUserFromInputs = () => {
  const storedUser = loadUserFromLocalStorage();

  currentUser = {
    cpf: cpfInput.value.trim() || (storedUser && storedUser.cpf) || null,
    email: emailInput.value.trim() || (storedUser && storedUser.email) || null,
  };

  saveUserToLocalStorage(currentUser);
};

const addMessageToHistory = (message) => {
  const messageHistory = JSON.parse(
    localStorage.getItem("messageHistory") || "[]",
  );

  const messageEntry = {
    user: currentUser,
    origin: "user",
    text: message,
    timestamp: new Date().toISOString(),
  };

  messageHistory.push(messageEntry);
  localStorage.setItem("messageHistory", JSON.stringify(messageHistory));
};

const handleSendMessage = () => {
  updateUserFromInputs();

  const message = messageInput.value.trim();
  if (message) {
    const wasFirstMessage =
      JSON.parse(localStorage.getItem("messageHistory") || "[]").length === 0;
    addMessageToHistory(message);
    messageInput.value = "";

    if (wasFirstMessage) {
      document.querySelector(".onboarding").classList.add("hidden");
      document.querySelector(".chat-interface").classList.remove("hidden");
    }
  }

  checkStepState();
};

const resetUser = () => {
  localStorage.removeItem("user");
  location.reload();
};

const initialize = () => {
  const storedUser = loadUserFromLocalStorage();
  const messageHistory = JSON.parse(
    localStorage.getItem("messageHistory") || "[]",
  );

  if (storedUser) {
    currentUser = storedUser;
  }

  const onboarding = document.querySelector(".onboarding");
  onboarding.classList.remove("hidden");

  if (messageHistory.length > 0) {
    // window.location.href = "pages/chat.html";
  } else {
    onboarding.classList.remove("hide");
    hideAllInputs();
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
    restartButton.addEventListener("click", resetUser);
  }
};

document.addEventListener("DOMContentLoaded", initialize);
