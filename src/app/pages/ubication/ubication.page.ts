import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-ubication',
  templateUrl: './ubication.page.html',
  styleUrls: ['./ubication.page.scss'],
})
export class UbicationPage implements OnInit {

  map: any;
  infoWindows: any[] = [];
  markers: any[] = [];
  
  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const nombreProducto = params['nombreProducto'];
      const descripcionProducto = params['descripcionProducto'];
      const nombreUsuario = params['nombreUsuario'];
      const coordenadasUsuario = JSON.parse(params['coordenadasUsuario']);

      // Llamar a la función para inicializar el mapa y agregar marcadores
      this.initMap(coordenadasUsuario, nombreProducto, descripcionProducto, nombreUsuario);
    });

    // Obtener la ubicación actual del usuario al cargar la página
    this.obtenerUbicacionActual();
  }
  
  initMap(coordenadasUsuario: any, nombreProducto: string, descripcionProducto: string, nombreUsuario: string) {
    // Crear el mapa si aún no está creado
    if (!this.map) {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: coordenadasUsuario,
        zoom: 12
      });
    }

    // Crear un marcador en las coordenadas recibidas
    const marker = new google.maps.Marker({
      position: coordenadasUsuario,
      map: this.map,
      title: nombreProducto
    });
  
    // Crear el contenido del infowindow del marcador
    const contentString = `
      <div>
        <h3>${nombreUsuario}</h3>
        <p><strong>Nombre del producto:</strong> ${nombreProducto}</p>
        <p><strong>Descripción:</strong> ${descripcionProducto}</p>
        <p><strong>WhatsApp:</strong> <a href="https://api.whatsapp.com/send?phone=+56962810616">Enviar mensaje</a></p>
      </div>
    `;
  
    // Crear el infowindow del marcador
    const infowindow = new google.maps.InfoWindow({
      content: contentString
    });
  
    // Abrir el infowindow cuando se haga clic en el marcador
    marker.addListener('click', () => {
      infowindow.open(this.map, marker);
    });
  
    // Agregar el infowindow y el marcador a las listas correspondientes
    this.infoWindows.push(infowindow);
    this.markers.push(marker);
  }

  obtenerUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const ubicacionActual = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Llamar a la función para inicializar el mapa con la ubicación actual
        this.map.setCenter(ubicacionActual);
      }, (error) => {
        console.error('Error al obtener la ubicación actual:', error);
        // Manejar el error aquí
      });
    } else {
      console.error('La geolocalización no está disponible en este dispositivo.');
      // Manejar el caso en el que la geolocalización no está disponible
    }
  }

  // Función para cerrar todos los infowindows
  closeAllInfoWindows() {
    this.infoWindows.forEach(infoWindow => {
      infoWindow.close();
    });
  }

  // Función para salir de sesión
  signOut() {
    this.router.navigate(['/']);
  }
}
