export default interface IBook {
  id: string;
  title: string;
  publisher: string;
  publishedAt: Date;
  description: string;
  isbn: string | null;
  pageCount: number;
  averageRating: number;
  ratingCount: number;
  language: string;
  infoLink: string;
  authors: Array<string>;
  imageUrls: Array<string>;
  categories: Array<string>;
}
