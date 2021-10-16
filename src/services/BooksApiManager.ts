import axios from "axios";
import BookItemMapper from "../data/mappers/BookItemMapper";
import IBook from "../data/models/book/IBook";

const booksApi = axios.create({
  baseURL: "https://www.googleapis.com/books/v1",
});

interface BooksApiResponse {
  items: Array<any>,
  kind: string,
  totalItems: number
}

const mapper = new BookItemMapper();

export default class BooksApiMAnager {
  async search(query: string, startIndex: number = 0) {
    const result = await booksApi.get<BooksApiResponse>("volumes", {
      params: {
        q: encodeURIComponent(query),
        startIndex: startIndex,
        maxResults: 40
      },
    });

    return result.data.items.map(item => mapper.map(item));
  }

  async getBook(bookId: string): Promise<IBook> {
    const result = await booksApi.get<any>(`volumes/${bookId}`);
    try {
      return mapper.map(result.data);
    } catch (e) {
      return Promise.reject("Falha ao buscar volume");
    }
  }
}
