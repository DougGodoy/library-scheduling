
export interface Computer {
  id: number;
  name: string;
  description: string;
  available: boolean;
}

export interface Reservation {
  id: number;
  computer: Computer;
  userName: string;
  dateTime: string;
}

export interface ReservationRequest {
  computerId: number;
  userName: string;
  dateTime: string;
}

export interface ComputerCreateRequest {
  name: string;
  description: string;
}
