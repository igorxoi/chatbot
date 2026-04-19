const BASE_URL = 'http://localhost:3000/clients';

async function getClients() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || 'Tivemos um problema, tente mais tarde!',
        clients: [],
      };
    }

    return {
      success: true,
      message: data?.message,
      clients: data?.clients ? data.clients : [],
    };
  } catch (error) {
    return {
      success: false,
      message: 'Tivemos um problema, tente mais tarde!',
      clients: [],
    };
  }
}

async function add(cliente) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Tivemos um problema, tente mais tarde!',
    };
  }
}

async function update(id, cliente) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || 'Tivemos um problema, tente mais tarde!',
      };
    }

    return {
      success: true,
      message: data?.message,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Tivemos um problema, tente mais tarde!',
    };
  }
}

async function remove(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || 'Tivemos um problema, tente mais tarde!',
      };
    }

    return {
      success: true,
      message: data?.message,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Tivemos um problema, tente mais tarde!',
    };
  }
}

export const clientsService = { getClients, add, update, remove };
