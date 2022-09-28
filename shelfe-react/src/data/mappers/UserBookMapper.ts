import { BookStatus } from "../../domain/BookStatus";
import IBook from "../models/book/IBook";
import IUserBook from "../models/book/IUserBook";

export default class UserBookMapper {
  map(book: IBook): IUserBook {
    return {
      id: book.id,
      title: book.title,
      publisher: book.publisher,
      publishedAt: book.publishedAt,
      description: book.description,
      isbn: book.isbn,
      pageCount: book.pageCount,
      averageRating: book.averageRating,
      ratingCount: book.ratingCount,
      language: book.language,
      authors: book.authors,
      imageUrls: book.imageUrls,
      categories: book.categories,
      userRating: 0,
      progress: 0,
      status: BookStatus.NotAdded,
      lastStatus: new Date(),
      favorite: false,
      lastModified: new Date(),
      notes: null
    } as IUserBook;
  }

  unmap(userBook: IUserBook) {
    return {
      id: userBook.id,
      title: userBook.title,
      publisher: userBook.publisher,
      publishedAt: userBook.publishedAt,
      description: userBook.description,
      isbn: userBook.isbn,
      pageCount: userBook.pageCount,
      averageRating: userBook.averageRating,
      ratingCount: userBook.ratingCount,
      language: userBook.language,
      authors: userBook.authors,
      imageUrls: userBook.imageUrls,
      categories: userBook.categories,
    } as IBook;
  }
}