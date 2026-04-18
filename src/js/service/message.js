const BASE_URL = 'https://baconipsum.com/api/?type=all-meat&paras=1';

const getRandomMessage = async () => {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error('Erro ao buscar mensagem');
    }

    const data = await response.json();
    return { success: true, message: data[0] };
  } catch (error) {
    return { success: false, message: 'Erro ao buscar mensagem' };
  }
};

export const messageService = { getRandomMessage };
