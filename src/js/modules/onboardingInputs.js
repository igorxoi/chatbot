let configuredInputs = [];
let configuredMessageBanner = null;

const setup = ({ inputs, messageBanner }) => {
  configuredInputs = inputs || [];
  configuredMessageBanner = messageBanner || null;
};

const hideAllInputs = (inputs = configuredInputs) => {
  inputs.forEach((input) => {
    input.classList.add('hide');
  });
};

const showInput = (input, message, messageBanner = configuredMessageBanner) => {
  if (!messageBanner) {
    return;
  }

  input.classList.remove('hide');
  messageBanner.textContent = message;
};

export const onboardingInputs = { setup, hideAllInputs, showInput };
