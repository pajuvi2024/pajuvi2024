import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-ubication-especifica',
  templateUrl: './ubication-especifica.page.html',
  styleUrls: ['./ubication-especifica.page.scss'],
})
export class UbicationEspecificaPage implements OnInit {
  map: any;
  infoWindows: any[] = [];
  markers: any[] = [];
  coordenadas: { lat: number; lng: number; };
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    // Verificar si el mapa ya está inicializado
    if (!this.map) {
      this.activatedRoute.queryParams.subscribe(params => {
        const coordenadasEspecifica = params['coordenadasEspecifica'];

        if (coordenadasEspecifica) {
          try {
            const coordenadas = JSON.parse(coordenadasEspecifica);
            const lat = coordenadas['lat'];
            const lng = coordenadas['lng'];
            this.centrarMapa(lat, lng);
          } catch (error) {
            console.error('Error al analizar las coordenadas:', error);
          }
        } else {
          console.error('Los parámetros lat y lng no están presentes en la URL.');
        }

        const nombreProducto = params['nombreProducto'];
        const descripcionProducto = params['descripcionProducto'];
        const nombreUsuario = params['nombreUsuario'];
        const numeroContacto = params['numeroContacto'];
        const coordenadasUsuarioString = params['coordenadasUsuario'];
        if (coordenadasUsuarioString) {
          try {
            const coordenadasUsuario = JSON.parse(coordenadasUsuarioString);
            this.initMap(coordenadasUsuario, nombreProducto, descripcionProducto, nombreUsuario,  numeroContacto);
          } catch (error) {
            console.error('Error al analizar las coordenadas del usuario:', error);
          }
        } else {
          console.error('Las coordenadas del usuario no están definidas.');
        }
      });

     
    }
  }
  
  private mapInitialized: boolean = false;

  centrarMapa(lat: number, lng: number) {
    if (!this.map) {
      return; // Mapa no inicializado aún
    }
    this.map.setCenter({ lat: lat, lng: lng });
  }

  

 initMap(coordenadasUsuario: any, nombreProducto: string, descripcionProducto: string, nombreUsuario: string, numeroContacto: string)   {
  if (!this.mapInitialized) {
    this.mapInitialized = true;

    const centerCoordinates = coordenadasUsuario;
    this.centrarMapa(centerCoordinates.lat, centerCoordinates.lng); // Centrar el mapa en las coordenadas proporcionadas

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: centerCoordinates,
      zoom: 14
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
    <div style="font-size: 13px; max-width: 167px; padding: 5px; margin: 0;">
      <h6 style="margin: 0;">${nombreUsuario}</h6>
      <p style="margin: 0;"> ${nombreProducto}</p>
      <p style="margin: 0;"><strong>Descripción:</strong> ${descripcionProducto}</p>
      <p style="margin: 0;"><strong>WhatsApp:</strong> <a href="https://api.whatsapp.com/send?phone=+56>${numeroContacto}<" style="text-decoration: none;">Enviar mensaje</a></p>
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

  agregarMarcadorUbicacionActual(ubicacionActual: any) {
    if (this.map) {
      const iconoUrl = 'assets/fotos/circulo.png';
      const iconoTamaño = new google.maps.Size(50, 50);

      const marker = new google.maps.Marker({
        position: ubicacionActual,
        map: this.map,
        title: 'Ubicación Actual',
        icon: {
          url: iconoUrl,
          scaledSize: iconoTamaño,
          anchor: new google.maps.Point(20, 40)
        }
      });

      this.markers.push(marker);
    } else {
      console.error('El mapa no está inicializado.');
    }
  }

  closeAllInfoWindows() {
    this.infoWindows.forEach(infoWindow => {
      infoWindow.close();
    });
  }

  signOut() {
    this.router.navigate(['/']);
  }
  
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
