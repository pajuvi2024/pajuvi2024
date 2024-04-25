import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class MarcadorService {


  private locationSource = new BehaviorSubject<{latitude: number, longitude: number} | null>(null);
  currentLocation = this.locationSource.asObservable();

  constructor() { }

  updateLocation(location: {latitude: number, longitude: number}): void {
    this.locationSource.next(location);
    console.log('ubicacion tiempo real', location, )
  }
 
 
}
