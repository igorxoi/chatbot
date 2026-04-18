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

export const clientsService = { getClients };
