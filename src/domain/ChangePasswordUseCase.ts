import { Auth, updatePassword } from "firebase/auth";

export default class ChangePasswordUseCase {
  execute(auth: Auth, newPassword: string): Promise<void> {
    return updatePassword(auth.currentUser!!, newPassword);
  }
}
