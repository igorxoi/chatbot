const hideAllInputs = (inputs) => {
  inputs.forEach((input) => {
    input.classList.add('hide');
  });
};

const showInput = (input, messageBanner, message) => {
  input.classList.remove('hide');
  messageBanner.textContent = message;
};

export const onboardingInputs = { hideAllInputs, showInput };
