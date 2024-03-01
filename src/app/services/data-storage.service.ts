import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private localStorageKey = 'dataGym';

  setDataGym(dataGym: any) {
    // Convierte los datos a JSON y guárdalos en el almacenamiento local
    const jsonData = JSON.stringify(dataGym);
    localStorage.setItem(this.localStorageKey, jsonData);
  }

  getDataGym() {
    // Obtiene los datos del almacenamiento local y los convierte de JSON
    const jsonData = localStorage.getItem(this.localStorageKey);
    return JSON.parse(jsonData);
  }

  clearDataGym() {
    // Elimina los datos del almacenamiento local
    localStorage.removeItem(this.localStorageKey);
  }


}

