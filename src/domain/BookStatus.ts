export enum BookStatus {
  NotAdded = -1,
  Dropped = 0,
  Reading = 1,
  OnHold = 2,
  Finished = 3,
  PlanToRead = 4,
}

export default function parseBookStatus(status: BookStatus) {
  switch (status) {
    case BookStatus.Dropped:
      return "Desistido";
    case BookStatus.NotAdded:
      return "Não adicionado";
    case BookStatus.Reading:
      return "Lendo";
    case BookStatus.OnHold:
      return "Em espera";
    case BookStatus.Finished:
      return "Lido";
    case BookStatus.PlanToRead:
      return "Planejo ler";
    default:
      return "Status desconhecido";
  }
}