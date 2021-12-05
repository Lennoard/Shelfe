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

export function parseBookStatusInt(status: BookStatus){
  switch (status) {
    case BookStatus.NotAdded:
      return -1;
    case BookStatus.Dropped:
      return 0;
    case BookStatus.Reading:
      return 1;
    case BookStatus.OnHold:
      return 2;
    case BookStatus.Finished:
      return 3;
    case BookStatus.PlanToRead:
      return 4;
  }
}

export function parseBookStatusIntToTitle(status: number){
  switch (status) {
    case -1:
      return "Não adicionado";
    case 0:
      return "Desistido";
    case 1:
      return "Lendo";
    case 2:
      return "Em espera";
    case 3:
      return "Acabado";
    case 4:
      return "Planejo ler";
  }
}