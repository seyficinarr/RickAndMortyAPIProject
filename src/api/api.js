import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
});

export const getCharacters = async () => {
  try {
    let allCharacters = [];
    let page = 1;
    let totalPages = 42; // Assuming you know there are 42 pages

    while (page <= totalPages) {
      const response = await api.get(`/character/?page=${page}`);
      allCharacters.push(...response.data.results);
      page++;
    }

    return allCharacters;
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error; // Handle or rethrow the error as needed
  }
};