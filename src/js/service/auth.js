const BASE_URL = 'http://localhost:3000/login';

async function login(cpf, email) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, email }),
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Tivemos um problema, tente mais tarde!',
    };
  }
}

export const authService = { login };
