import { Auth } from "@firebase/auth";
import { Firestore } from "@firebase/firestore";
import IUserBook from "../../data/models/book/IUserBook";
import IFirestoreManager from "./IFirestoreManager";

export default class FirestoreManagerImpl implements IFirestoreManager {
  auth: Auth;
  firestore: Firestore;

  constructor(auth: Auth, firestore: Firestore) {
    this.auth = auth;
    this.firestore = firestore;
  }
  
  getUserBooks(): Array<IUserBook> {

    return [];
  }
}