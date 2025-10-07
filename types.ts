
export enum Status {
  Processed = 'Procesado',
  Pending = 'Pendiente',
  Error = 'Error',
}

export interface URLOption {
  id: number;
  url: string;
  status: Status;
  timestamp: string;
}
