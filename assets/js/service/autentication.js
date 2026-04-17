const BASE_URL = "http://localhost:3000/login";

export async function login(cpf, email) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cpf, email }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return {
      success: false,
      message: "Tivemos um problema, tente mais tarde!",
    };
  }
}
