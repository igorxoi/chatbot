export const hideAllInputs = (inputs) => {
  inputs.forEach((input) => {
    input.classList.add('hide');
  });
};

export const showInput = (input, messageBanner, message) => {
  input.classList.remove('hide');
  messageBanner.textContent = message;
};
