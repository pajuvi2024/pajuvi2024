import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  reservas: any[] = [];
  constructor() { }


  agregarReserva(reserva: any) {
    this.reservas.push(reserva);
  }

  obtenerReservas() {
    return this.reservas;
  }


}
