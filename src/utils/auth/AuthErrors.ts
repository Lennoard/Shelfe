export default function showLocalizedAuthError(message: string) {
  if (message.includes("wrong-password")) {
    return "A senha é inválida ou o usuário não tem uma senha";
  }

  if (message.includes("weak-password")) {
    return "A senha deve ter 6 caracteres ou mais.";
  }

  if (message.includes("user-not-found")) {
    return "Endereço de email ou senha inválidos";
  }

  return "Falha de autenticação";

}