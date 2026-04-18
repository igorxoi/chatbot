import { listeners } from '../modules/listeners.js';

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

let editingClientIndex = null;

const mockClients = [
  {
    nome: 'Igor Xavier',
    cpf: '123.456.789-00',
    admin: true,
    cartao: {
      numero_final: '1234',
      limite_total: 5000,
      limite_disponivel: 3200,
      valor_fatura: 1800,
      status_cartao: 'ativo',
    },
  },
  {
    nome: 'Maria Silva',
    cpf: '987.654.321-00',
    admin: false,
    cartao: {
      numero_final: '5678',
      limite_total: 3000,
      limite_disponivel: 1500,
      valor_fatura: 1500,
      status_cartao: 'bloqueado',
    },
  },
  {
    nome: 'Joao Pedro',
    cpf: '456.123.789-10',
    email: 'joao.pedro@email.com',
    admin: false,
    cartao: {
      numero_final: '8821',
      tipo_cartao: 'virtual',
      limite_total: 4200,
      limite_disponivel: 2800,
      valor_fatura: 1400,
      status_cartao: 'ativo',
      data_vencimento: '2026-04-28',
    },
  },
  {
    nome: 'Fernanda Costa',
    cpf: '741.258.963-11',
    email: 'fernanda.costa@email.com',
    admin: false,
    cartao: {
      numero_final: '3045',
      tipo_cartao: 'fisico',
      limite_total: 7800,
      limite_disponivel: 6100,
      valor_fatura: 1700,
      status_cartao: 'ativo',
      data_vencimento: '2026-05-10',
    },
  },
  {
    nome: 'Lucas Almeida',
    cpf: '159.357.456-22',
    email: 'lucas.almeida@email.com',
    admin: true,
    cartao: {
      numero_final: '7190',
      tipo_cartao: 'virtual',
      limite_total: 9500,
      limite_disponivel: 2200,
      valor_fatura: 7300,
      status_cartao: 'bloqueado',
      data_vencimento: '2026-04-24',
    },
  },
  {
    nome: 'Camila Rocha',
    cpf: '852.741.963-33',
    email: 'camila.rocha@email.com',
    admin: false,
    cartao: {
      numero_final: '4412',
      tipo_cartao: 'fisico',
      limite_total: 2600,
      limite_disponivel: 950,
      valor_fatura: 1650,
      status_cartao: 'ativo',
      data_vencimento: '2026-05-03',
    },
  },
  {
    nome: 'Bruno Martins',
    cpf: '963.852.147-44',
    email: 'bruno.martins@email.com',
    admin: false,
    cartao: {
      numero_final: '1287',
      tipo_cartao: 'virtual',
      limite_total: 5100,
      limite_disponivel: 4700,
      valor_fatura: 400,
      status_cartao: 'ativo',
      data_vencimento: '2026-05-14',
    },
  },
];

const formInputs = [
  nameInput,
  cpfInput,
  emailInput,
  cardNumberInput,
  totalLimitInput,
  availableLimitInput,
  invoiceInput,
  dueDateInput,
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value) || 0);

const setEditingState = (isEditing) => {
  submitButton.textContent = isEditing
    ? 'Salvar alterações'
    : 'Cadastrar cliente';
  cancelButton.textContent = isEditing ? 'Cancelar edição' : 'Cancelar';
};

const clearForm = () => {
  nameInput.value = '';
  cpfInput.value = '';
  emailInput.value = '';
  adminInput.checked = false;
  cardNumberInput.value = '';
  cardTypeInput.value = '';
  cardStatusInput.value = '';
  totalLimitInput.value = '';
  availableLimitInput.value = '';
  invoiceInput.value = '';
  dueDateInput.value = '';
  editingClientIndex = null;
  setEditingState(false);
};

const fillForm = (client) => {
  nameInput.value = client.nome || '';
  cpfInput.value = client.cpf || '';
  emailInput.value = client.email || '';
  adminInput.checked = Boolean(client.admin);
  cardNumberInput.value = client.cartao.numero_final || '';
  cardTypeInput.value = client.cartao.tipo_cartao || '';
  cardStatusInput.value = client.cartao.status_cartao || '';
  totalLimitInput.value = client.cartao.limite_total || '';
  availableLimitInput.value = client.cartao.limite_disponivel || '';
  invoiceInput.value = client.cartao.valor_fatura || '';
  dueDateInput.value = client.cartao.data_vencimento || '';
};

const buildClientData = () => ({
  nome: nameInput.value.trim(),
  cpf: cpfInput.value.trim(),
  email: emailInput.value.trim(),
  admin: adminInput.checked,
  cartao: {
    numero_final: cardNumberInput.value.trim(),
    tipo_cartao: cardTypeInput.value.trim(),
    status_cartao: cardStatusInput.value.trim(),
    limite_total: Number(totalLimitInput.value),
    limite_disponivel: Number(availableLimitInput.value),
    valor_fatura: Number(invoiceInput.value),
    data_vencimento: dueDateInput.value,
  },
});

const createClientCard = (client, index) => {
  const card = document.createElement('article');
  const isAdmin =
    client.admin === true || client.admin === 'true' || client.admin === 1;
  const statusClass =
    client.cartao.status_cartao === 'ativo'
      ? 'register-status-active'
      : 'register-status-blocked';

  card.className = isAdmin ? 'register-card is-admin' : 'register-card';
  card.innerHTML = `
    <div class="register-card-header">
      <div>
        <h3 class="register-card-name">${client.nome}</h3>
        <p class="register-card-id">CPF ${client.cpf}</p>
      </div>
      <div class="register-card-meta">
        <div class="register-card-actions">
          <button type="button" class="register-card-action" data-action="edit" data-index="${index}">
            Editar dados
          </button>
          ${
            isAdmin
              ? ''
              : `<button
            type="button"
            class="register-card-action register-card-action-danger"
            data-action="remove"
            data-index="${index}"
          >
            Remover
          </button>`
          }
        </div>
        ${isAdmin ? '<span class="register-badge">Admin</span>' : ''}
      </div>
    </div>

    <div class="register-card-details">
      <div class="register-detail-row">
        <span class="register-detail-label">Cartão</span>
        <span class="register-detail-value">**** ${client.cartao.numero_final}</span>
      </div>
      <div class="register-detail-row">
        <span class="register-detail-label">Status</span>
        <span class="register-status-badge ${statusClass}">${client.cartao.status_cartao}</span>
      </div>
    </div>

    <div class="register-card-finance">
      <div class="register-finance-item">
        <span class="register-finance-label">Limite</span>
        <strong class="register-finance-value">${formatCurrency(client.cartao.limite_total)}</strong>
      </div>
      <div class="register-finance-item">
        <span class="register-finance-label">Disponível</span>
        <strong class="register-finance-value">${formatCurrency(client.cartao.limite_disponivel)}</strong>
      </div>
      <div class="register-finance-item register-finance-item-full">
        <span class="register-finance-label">Fatura</span>
        <strong class="register-finance-value">${formatCurrency(client.cartao.valor_fatura)}</strong>
      </div>
    </div>
  `;

  if (isAdmin) {
    const removeAction = card.querySelector('.register-card-action-danger');
    if (removeAction) {
      removeAction.remove();
    }
  }

  return card;
};

const renderClients = () => {
  clientList.innerHTML = '';
  mockClients.forEach((client, index) => {
    clientList.appendChild(createClientCard(client, index));
  });
};

const handleSubmit = () => {
  const clientData = buildClientData();

  if (editingClientIndex !== null) {
    mockClients[editingClientIndex] = clientData;
  } else {
    mockClients.push(clientData);
  }

  clearForm();
  renderClients();
};

const handleEdit = (index) => {
  const client = mockClients[index];
  if (!client) {
    return;
  }

  editingClientIndex = index;
  fillForm(client);
  setEditingState(true);
  nameInput.focus();
};

const handleRemove = (index) => {
  if (mockClients[index]?.admin) {
    return;
  }

  mockClients.splice(index, 1);

  if (editingClientIndex === index) {
    clearForm();
  } else if (editingClientIndex !== null && editingClientIndex > index) {
    editingClientIndex -= 1;
  }

  renderClients();
};

const handleCardActions = (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) {
    return;
  }

  const index = Number(actionButton.dataset.index);
  const action = actionButton.dataset.action;

  if (action === 'edit') {
    handleEdit(index);
  }

  if (action === 'remove') {
    handleRemove(index);
  }
};

const initialize = () => {
  registerPage.classList.remove('hidden');

  submitButton.addEventListener('click', handleSubmit);
  cancelButton.addEventListener('click', clearForm);
  clientList.addEventListener('click', handleCardActions);

  formInputs.forEach((input) => listeners.addEnterSubmit(input, handleSubmit));

  setEditingState(false);
  renderClients();
};

document.addEventListener('DOMContentLoaded', initialize);