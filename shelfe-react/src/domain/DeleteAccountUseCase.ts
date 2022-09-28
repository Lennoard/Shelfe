import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import FirestoreManagerImpl from "../services/firestore/FirestoreManagerImpl";

export default class DeleteAccountUseCase {
  execute(auth: Auth, firestore: Firestore): Promise<void> {
    return new FirestoreManagerImpl(auth, firestore).deleteUserData();
  }
}