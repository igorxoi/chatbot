
import { resetLocalStorage } from "./storage.js";

export const addRestartButtonListener = () => {
  const restartButton = document.getElementById("restart-button");
  restartButton.addEventListener("click", () => resetLocalStorage("user"));
};


