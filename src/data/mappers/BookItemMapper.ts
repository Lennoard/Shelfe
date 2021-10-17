import IBook from "../models/book/IBook";
import IMapper from "./IMapper";

export default class BookItemMapper implements IMapper<IBook> {
  map(from: any) {
    const volumeInfo = from.volumeInfo;
    const imageLinks = volumeInfo.imageLinks
    const industryIdentifiers = volumeInfo.industryIdentifiers;

    return {
      id: from.id,
      title: volumeInfo.title,
      publisher: volumeInfo.publisher
        ? volumeInfo.publisher
        : "Desconhecido",
      publishedAt: new Date(Date.parse(volumeInfo.publishedDate)),
      description: volumeInfo.description
        ? volumeInfo.description
        : "Nenhuma descrição encontrada",
      isbn: industryIdentifiers ? industryIdentifiers[0].identifier : null,
      pageCount: volumeInfo.pageCount ? volumeInfo.pageCount : 0,
      averageRating: volumeInfo.averageRating ? volumeInfo.averageRating : 0,
      ratingCount: volumeInfo.ratingsCount ? volumeInfo.ratingsCount : 0,
      language: volumeInfo.language,
      authors: volumeInfo.authors ? volumeInfo.authors : "Nenhum autor encontrado",
      imageUrls: imageLinks ? [
        imageLinks?.thumbnail,
        imageLinks?.smallThumbnail,
      ] : [],
      categories: volumeInfo.categories ? volumeInfo.categories : [],
    } as IBook;
  }
  
  unmap(from: IBook) {
    return {};
  }
  
}