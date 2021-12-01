import { BookStatus } from "../../../domain/BookStatus";
import INote from "../INote";
import IBook from "./IBook";

export default interface IUserBook extends IBook {
  userRating: number | null,
  progress: number,
  status: BookStatus,
  lastStatus: Date,
  favorite: boolean,
  lastModified: Date,
  notes: INote[] | null,
  statusRank: number
}
