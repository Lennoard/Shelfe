import { Auth, updateEmail } from "firebase/auth";

export default class ChangeEmailUseCase {
  execute(auth: Auth, newEmail: string): Promise<void> {
    return updateEmail(auth.currentUser!!, newEmail);
  }
}
