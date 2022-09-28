import { Auth, updateProfile } from "firebase/auth";

export default class ChangeDisplayNameUseCase {
  execute(auth: Auth, displayName: string): Promise<void> {
    return updateProfile(auth.currentUser!!, {
      displayName: displayName,
    });
  }
}
