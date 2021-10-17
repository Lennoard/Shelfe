import { Auth } from "@firebase/auth";
import { Firestore, QueryDocumentSnapshot, setDoc, UpdateData } from "@firebase/firestore";
import IUserBook from "../../data/models/book/IUserBook";
import IUserBookManager from "./IUserBookManager";

import { doc, getDoc, updateDoc, getDocs, collection, query } from "firebase/firestore";
import initFirebase from "../../firebase";

initFirebase();

export default class UserBookManagerImpl implements IUserBookManager {
  auth: Auth;
  firestore: Firestore;

  constructor(auth: Auth, firestore: Firestore) {
    this.auth = auth;
    this.firestore = firestore;
  }

  async getUserBooks() {
    let books = new Array<IUserBook>();
    const q = query(
      collection(this.firestore, `users/${this.uid()}/books`)
    ).withConverter(getUserBookConverter());

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      books.push({ ...doc.data(), id: doc.id });
    });

    return books;
  }

  async getUserBook(bookId: string) {
    const docRef = doc(
      this.firestore,
      `users/${this.uid()}/books`,
      bookId
    ).withConverter(getUserBookConverter());

    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return { ...docSnap.data(), id: bookId };
  }

  /**
   * Sends a whole userBook the the user books collection.
   * WARNING: THIS WILL OVERWRITE ANY PREVIOUS DOCUMENT WITH THIS BOOK'S ID.
   * For updating specific properties, use updateUserBook() instead.
   *
   * @param userBook particular user book
   * @returns A Promise resolved once the data has been successfully written
   * to the backend
   */
  async setUserBook(userBook: IUserBook) {
    const docRef = doc(
      this.firestore,
      `users/${this.uid}/books`,
      userBook.id
    ).withConverter(getUserBookConverter());

    return await setDoc(docRef, userBook);
  }

  async updateUserBook(bookId: string, data: UpdateData<IUserBook>) {
    const docRef = doc(this.firestore, `users/${this.uid}/books`, bookId);
    return await updateDoc(docRef, data);
  }

  uid() {
    return this.auth.currentUser!!.uid;
  }
}

function getUserBookConverter() {
  return {
    toFirestore: (data: IUserBook) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as IUserBook
  }
}
