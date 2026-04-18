import { listeners } from '../modules/listeners.js';
import { register } from '../modules/register.js';

const clientList = document.getElementById('client-list');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');
const registerPage = document.querySelector('.register');

const nameInput = document.getElementById('nome');
const cpfInput = document.getElementById('cpf');
const emailInput = document.getElementById('email');
const adminInput = document.getElementById('admin');
const cardNumberInput = document.getElementById('numero');
const cardTypeInput = document.getElementById('tipo');
const cardStatusInput = document.getElementById('status');
const totalLimitInput = document.getElementById('limiteTotal');
const availableLimitInput = document.getElementById('limiteDisponivel');
const invoiceInput = document.getElementById('fatura');
const dueDateInput = document.getElementById('vencimento');

const initialize = () => {
  register.setup({
    clientList,
    submitButton,
    cancelButton,
    registerPage,
    nameInput,
    cpfInput,
    emailInput,
    adminInput,
    cardNumberInput,
    cardTypeInput,
    cardStatusInput,
    totalLimitInput,
    availableLimitInput,
    invoiceInput,
    dueDateInput,
  });
  register.initialize();

  submitButton.addEventListener('click', register.handleSubmit);
  cancelButton.addEventListener('click', register.clearForm);
  clientList.addEventListener('click', register.handleCardActions);

  listeners.setup({ onEnterSubmit: register.handleSubmit });
};

document.addEventListener('DOMContentLoaded', initialize);
