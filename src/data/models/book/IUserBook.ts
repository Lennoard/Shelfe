import { BookStatus } from "../../../domain/BookStatus";
import INote from "../INote";
import IBook from "./IBook";

export default interface IUserBook extends IBook {
  userRating: number | null,
  progress: number,
  status: BookStatus,
  favorite: boolean,
  lastModified: Date,
  notes: INote[] | null
}
