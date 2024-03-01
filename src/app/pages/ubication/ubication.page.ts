import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorageService } from 'src/app/services/data-storage.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var google; 

@Component({
  selector: 'app-ubication',
  templateUrl: './ubication.page.html',
  styleUrls: ['./ubication.page.scss'],
})
export class UbicationPage implements OnInit {
  data: any;

  map: any; // Declara la variable para el mapa
  infoWindows: any = [];
  marcador: any = [];
 
  datos: any = [];
  constructor(private dataStorage: DataStorageService,
              private firebaseServ: FirebaseService,
              private  router: Router,
              private http: HttpClient
              ){ }


  async ngOnInit() {
    
    
    // Espera a que se agreguen los marcadores antes de continuar
 

    this.initMap();

  }


  signOut() {
    // Eliminar el token de autenticación de localStorage
    localStorage.removeItem('userToken');

    this.dataStorage.clearDataGym();
    
    // Llamar al método de signOut de Firebase si es necesario
    this.firebaseServ.signOut();
    
    // Navegar a la página de inicio
    this.router.navigate(['/']);
  }

  openMain() {
    // Abre la página de "Ubicaciones" con un pequeño retraso
    setTimeout(() => {
      this.router.navigate(['/main']);
    }, 400); // 300 milisegundos (ajusta este valor según tus necesidades)
  }
  initMap() {
    const mapEle: HTMLElement = document.getElementById('map');
    
    const myLatLng = { lat: -33.03356325015952, lng: -71.53317337493256 };
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 13
    });
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      this.addMarkersToMap(this.marcador);
    });
  }

  
 addMarkersToMap(marcador): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      for (let marker of marcador) {
        let position = new google.maps.LatLng(parseFloat(marker.latitud), parseFloat(marker.longitud));
        let mapMarker = new google.maps.Marker({
          position: position,
          nombre: marker.nombre,
          latitud: marker.latitud,
          longitud: marker.longitud,
          direccion: marker.direccion,
          horario: marker.horario
        });
        mapMarker.setMap(this.map);
        this.addInfoWindowToMarker(mapMarker);
      }
      resolve(); // Resuelve la promesa una vez que todos los marcadores se han agregado.
    });
  }


  addInfoWindowToMarker(marker) {
    let infoWindowContent = '<div id="content" class="info-window">' +
      '<h2 id="firstHeading" class="firstHeading">' + marker.nombre + '</h2>' +
      '<p>Direccion: ' + marker.direccion + '</p>' +
      '<p>Horario: ' + marker.horario + '</p>' +     
      '</div>';
  
    let infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
  
    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.setContent(infoWindowContent); // Aplica la clase CSS aquí
      infoWindow.open(this.map, marker);
    });
    this.infoWindows.push(infoWindow);
  }
  
  
  closeAllInfoWindows(){
    for(let window of this.infoWindows){
      window.close();
    }
  }
  buscarEnBaseDeDatos(tipoBusqueda: string, tipoUbicacion: string, terminoBusqueda: string): Observable<any> {
    // Lógica para buscar en la base de datos aquí...
    // Por ejemplo, podrías hacer una solicitud HTTP a tu backend.
    
    // Supongamos que estás usando HttpClient para realizar la solicitud HTTP
    return this.http.post<any>('/buscar', { tipoBusqueda, tipoUbicacion, terminoBusqueda });
  }

}
