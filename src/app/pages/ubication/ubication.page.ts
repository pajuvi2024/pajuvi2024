import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MarcadorService } from './../../services/marcador.service';



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
  coordenadas: { lat: number; lng: number; };

  currentLocation: { latitude: number, longitude: number } | null = null;




  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private marcadorService: MarcadorService
  ) { }

  ngOnInit() {
    // Verificar si el mapa ya está inicializado
    if (!this.map) {
      this.marcadorService.currentLocation.subscribe(location => {
        this.currentLocation = location;
        console.log('recibi datos del servicio marcador', location)

      });
    }

  this.marcadorService.currentLocation.subscribe(location2 => {
    if (location2) {
      // Obtener los datos adicionales necesarios del ActivatedRoute
      this.activatedRoute.queryParams.subscribe(params => {
        const nombreProducto = params['nombreProducto'];
        const descripcionProducto = params['descripcionProducto'];
        const nombreUsuario = params['nombreUsuario'];
        const numeroContacto = params['numeroContacto'];
        console.log('recibi datos del servicio marcador 2', location)

        // Llamar a updateMarker con los datos obtenidos
        this.updateMarker({
          latitude: location2.latitude,
          longitude: location2.longitude,
          nombreProducto: nombreProducto,
          descripcionProducto: descripcionProducto,
          nombreUsuario: nombreUsuario,
          numeroContacto: numeroContacto
        });
      });
    }
  });

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
          
        }

        const nombreProducto = params['nombreProducto'];
        const descripcionProducto = params['descripcionProducto'];
        const nombreUsuario = params['nombreUsuario'];
        const numeroContacto = params['numeroContacto'];
        const coordenadasUsuarioString = params['coordenadasUsuario'];
        
        
        if (coordenadasUsuarioString) {
          try {
            const coordenadasUsuario = JSON.parse(coordenadasUsuarioString);
            this.initMap(coordenadasUsuario, nombreProducto, descripcionProducto, nombreUsuario, numeroContacto);
          } catch (error) {
            console.error('Error al analizar las coordenadas del usuario:', error);
          }
        } else {
          console.error('Las coordenadas del usuario no están definidas.');
        }
      });

      // Obtener la ubicación actual del usuario al cargar la página
      this.obtenerUbicacionActual();
    }
  
  
    
  
  private mapInitialized: boolean = false;

  centrarMapa(lat: number, lng: number) {
    if (!this.map) {
      return; // Mapa no inicializado aún
    }
    this.map.setCenter({ lat: lat, lng: lng });
  }

  obtenerUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const ubicacionActual = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      
        if (ubicacionActual && ubicacionActual.lat !== undefined && ubicacionActual.lng !== undefined) {
          // Llamar a la función para inicializar el mapa con la ubicación actual
          if (this.map) {
            this.map.setCenter(ubicacionActual);
            // Llamar a la función para agregar el marcador de ubicación actual
            this.agregarMarcadorUbicacionActual(ubicacionActual);
          } else {
            console.error('El mapa no se ha inicializado correctamente.');
          }
        } else {
          console.error('No se pudieron obtener las coordenadas de la ubicación actual.');
        }
      }, (error) => {
        console.error('Error al obtener la ubicación actual:', error);
        // Manejar el error aquí
      });
    } else {
      console.error('La geolocalización no está disponible en este dispositivo.');
      // Manejar el caso en el que la geolocalización no está disponible
    }
  }

  initMap(coordenadasUsuario: any, nombreProducto: string, descripcionProducto: string, nombreUsuario: string, numeroContacto: string) {
    if (!this.mapInitialized) {
      this.mapInitialized = true;
  
    const centerCoordinates = coordenadasUsuario;
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: centerCoordinates,
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
    <div style="font-size: 13px; max-width: 167px; padding: 5px; margin: 0;">
      <h6 style="margin: 0;"> ${nombreUsuario}</h6>
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

  updateMarker(location2: { latitude: number, longitude: number, nombreProducto?: string, descripcionProducto?: string, nombreUsuario?: string, numeroContacto?: string }) {
    const iconoUrl = 'assets/fotos/green_marker.png';  // Asegúrate de que el camino al icono es correcto
    const iconoTamaño = new google.maps.Size(80, 50);
  
    const marker = new google.maps.Marker({
      position: {
        lat: location2.latitude,
        lng: location2.longitude
      },
      map: this.map,
      title: 'Ubicación Actualizada',
      icon: {
        url: iconoUrl,
        scaledSize: iconoTamaño,
        anchor: new google.maps.Point(16, 32)
      },
      animation: google.maps.Animation.DROP
    });
  
    // Crear el contenido del infowindow del marcador
    const contentString = `
    <div style="font-size: 13px; max-width: 167px; padding: 5px; margin: 0;">
    <p style="margin: 0;"><strong>Ubicación tiempo real de:</strong> ${location2.nombreUsuario}</p>
      <p style="margin: 0;"> <strong>Producto:</strong>${location2.nombreProducto}</p>
      <p style="margin: 0;"><strong>Descripción:</strong> ${location2.descripcionProducto}</p>
      <p style="margin: 0;"><strong>WhatsApp:</strong> <a href="https://api.whatsapp.com/send?phone=+56>${location2.numeroContacto}<" style="text-decoration: none;">Enviar mensaje</a></p>
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
  




  closeAllInfoWindows() {
    this.infoWindows.forEach(infoWindow => {
      infoWindow.close();
    });
  }

  signOut() {
    this.router.navigate(['/']);
  }
}
