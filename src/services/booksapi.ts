import axios from "axios";

const booksApi = axios.create({
  baseURL: "https://www.googleapis.com/books/v1"
});

export default booksApi;
