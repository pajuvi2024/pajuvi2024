import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarcadorService {

  marcadores: any[] = [];

  constructor() { }

  agregarMarcador(marcador: any) {
    this.marcadores.push(marcador);
  }

  obtenerMarcadores() {
    return this.marcadores;
  }
}
