import { UpdateData } from "@firebase/firestore";
import IUserBook from "../../data/models/book/IUserBook";
import IFirestoreManager from "../firestore/IFirestoreManager";

export default interface IUserBookManager extends IFirestoreManager {
  getUserBooks: () => Promise<Array<IUserBook>>;
  getUserBook: (bookId: string) => Promise<IUserBook | null>;
  setUserBook: (userBook: IUserBook) => Promise<void>;
  updateUserBook: (bookId: string, data: UpdateData<IUserBook>) => Promise<void>;
}
