import { addMessageToHistory } from "./chat.js";
import {
  addEnterSubmitListener,
  addRestartButtonListener,
} from "./listeners.js";
import { getRandomMessage } from "./message.js";
import { loadFromLocalStorage } from "./storage.js";

const messageInput = document.getElementById("message");
const messageContainer = document.querySelector(".message-list");

const scrollChatToBottom = () => {
  const messageList = document.querySelector(".message-list");
  messageList.scrollTop = messageList.scrollHeight;
};

const renderMessages = () => {
  const messageHistory = loadFromLocalStorage("messageHistory") || [];
  messageContainer.innerHTML = "";

  messageHistory.forEach((msg) => {
    const bubble = document.createElement("div");

    bubble.classList.add(
      "message-bubble",
      msg.origin === "user" ? "left" : "right",
    );

    bubble.innerHTML = `<p class="message">${msg.text}</p>`;
    messageContainer.appendChild(bubble);
  });
};

const handleSendMessage = () => {
  const message = messageInput.value.trim();

  if (!message) return;

  addMessageToHistory(message, "user");
  renderMessages();

  setTimeout(async () => {
    const { message } = await getRandomMessage();
    addMessageToHistory(message, "bot");
    renderMessages();
    scrollChatToBottom();
  }, 1000);

  messageInput.value = "";
  scrollChatToBottom();
};

const initialize = () => {
  const chatInterface = document.querySelector(".chat-interface");
  chatInterface.classList.remove("hidden");

  renderMessages();

  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", handleSendMessage);

  addRestartButtonListener();
  addEnterSubmitListener(messageInput, handleSendMessage);

  window.addEventListener("load", () => {
    scrollChatToBottom();
  });
};

document.addEventListener("DOMContentLoaded", initialize);
