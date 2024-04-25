import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoStateService {
  private gpsEnabledSource = new BehaviorSubject<boolean>(false);

  gpsEnabled$ = this.gpsEnabledSource.asObservable();

  constructor() {
    this.loadInitialGPSState();
  }

  private loadInitialGPSState() {
    const storedGPSState = localStorage.getItem('gpsEnabled');
    const state = storedGPSState ? JSON.parse(storedGPSState) : false;
    this.gpsEnabledSource.next(state);
  }

  setGPSEnabled(enabled: boolean) {
    this.gpsEnabledSource.next(enabled);
    localStorage.setItem('gpsEnabled', JSON.stringify(enabled));
  }
}
