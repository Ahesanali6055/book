import axios from "axios";

const BASE_URL = "https://crudcrud.com/api/a8784d64df3e4b49afa4f1cb8e85f1bd";
const BOOKS_ENDPOINT = `${BASE_URL}/books`;

export const getBooks = () => axios.get(BOOKS_ENDPOINT);
export const addBook = (book) => axios.post(BOOKS_ENDPOINT, book);
export const updateBook = (id, book) => axios.put(`${BOOKS_ENDPOINT}/${id}`, book);
export const deleteBook = (id) => axios.delete(`${BOOKS_ENDPOINT}/${id}`);
