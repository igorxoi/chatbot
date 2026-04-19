import { clientsService } from '../service/clients.js';

const clients = [];

let clientList;
let submitButton;
let cancelButton;
let registerPage;
let nameInput;
let cpfInput;
let emailInput;
let adminInput;
let cardNumberInput;
let cardTypeInput;
let cardStatusInput;
let totalLimitInput;
let availableLimitInput;
let invoiceInput;
let dueDateInput;
let editingIndex = null;


const setup = (elements) => {
  clientList = elements.clientList;
  submitButton = elements.submitButton;
  cancelButton = elements.cancelButton;
  registerPage = elements.registerPage;
  nameInput = elements.nameInput;
  cpfInput = elements.cpfInput;
  emailInput = elements.emailInput;
  adminInput = elements.adminInput;
  cardNumberInput = elements.cardNumberInput;
  cardTypeInput = elements.cardTypeInput;
  cardStatusInput = elements.cardStatusInput;
  totalLimitInput = elements.totalLimitInput;
  availableLimitInput = elements.availableLimitInput;
  invoiceInput = elements.invoiceInput;
  dueDateInput = elements.dueDateInput;
};

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
  editingIndex = null;
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
  clients.forEach((client, index) => {
    clientList.appendChild(createClientCard(client, index));
  });
};

const loadClients = async () => {
  const response = await clientsService.getClients();
  const loadedClients = response.success ? response.clients : [];
  clients.splice(0, clients.length, ...loadedClients);
};

const handleSubmit = async () => {
  const clientData = buildClientData();

  if (editingIndex !== null) {
    const id = clients[editingIndex].id;
    const response = await clientsService.update(id, clientData);

    if (!response.success) {
      return;
    }

    clients[editingIndex] = { ...clientData, id };
  } else {
    const response = await clientsService.add(clientData);

    if (!response.success) {
      return;
    }

    clients.push({ ...clientData, id: response.id });
  }

  clearForm();
  renderClients();
};

const handleEdit = (index) => {
  const client = clients[index];
  if (!client) {
    return;
  }

  editingIndex = index;
  fillForm(client);
  setEditingState(true);
  nameInput.focus();
};

const handleRemove = async (index) => {
  const client = clients[index];

  if (client?.admin) {
    return;
  }

  const response = await clientsService.remove(client.id);

  if (!response.success) {
    return;
  }

  clients.splice(index, 1);

  if (editingIndex === index) {
    clearForm();
  } else if (editingIndex !== null && editingIndex > index) {
    editingIndex -= 1;
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

const initialize = async () => {
  registerPage.classList.remove('hidden');
  setEditingState(false);

  await loadClients();
  renderClients();
};

export const register = {
  setup,
  clearForm,
  handleCardActions,
  handleSubmit,
  initialize,
};