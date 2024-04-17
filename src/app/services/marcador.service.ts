import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarcadorService {

  private coordinatesSource = new BehaviorSubject<{ lat: number, lng: number }>({ lat: 0, lng: 0 });
  currentCoordinates = this.coordinatesSource.asObservable();


  constructor() { }


  updateCoordinates(coordinates: { lat: number, lng: number }) {
    this.coordinatesSource.next(coordinates);
  }



}
