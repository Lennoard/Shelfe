import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export default interface IFirestoreManager {
  auth: Auth;
  firestore: Firestore;

  deleteUserData: () => Promise<void>;
}