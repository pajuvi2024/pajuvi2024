import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-ubication-especifica',
  templateUrl: './ubication-especifica.page.html',
  styleUrls: ['./ubication-especifica.page.scss'],
})
export class UbicationEspecificaPage implements OnInit {

  map: any;
  markers: any[] = [];
  coordenadas: any;
  nombreProducto: string;
  descripcionProducto: string;
  nombreUsuario: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const lat = parseFloat(params['lat']);
      const lng = parseFloat(params['lng']);
      if (!isNaN(lat) && !isNaN(lng)) {
        this.coordenadas = { lat: lat, lng: lng };
        this.nombreProducto = params['nombreProducto'];
        this.descripcionProducto = params['descripcionProducto'];
        this.nombreUsuario = params['nombreUsuario'];
        this.initMap(this.coordenadas);
      } else {
        console.error('Las coordenadas especificadas no son válidas');
      }
    });
  }

  initMap(coordenadas: any) {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: coordenadas,
      zoom: 15
    });

    const iconoUrl = 'assets/fotos/circulo.png';
    const iconoTamaño = new google.maps.Size(50, 50);

    const marker = new google.maps.Marker({
      position: coordenadas,
      map: this.map,
      title: this.nombreProducto,
      icon: {
        url: iconoUrl,
        scaledSize: iconoTamaño,
        anchor: new google.maps.Point(20, 40)
      }
    });

    // Crear el contenido del infowindow del marcador
    const contentString = `
      <div style="font-size: 12px; max-width: 155px; padding: 5px; margin: 0;">
        <h6 style="margin: 0;">${this.nombreUsuario}</h6>
        <p style="margin: 0;"> ${this.nombreProducto}</p>
        <p style="margin: 0;"><strong>Descripción:</strong> ${this.descripcionProducto}</p>
        <p style="margin: 0;"><strong>WhatsApp:</strong> <a href="https://api.whatsapp.com/send?phone=+56962810616" style="text-decoration: none;">Enviar mensaje</a></p>
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

    this.markers.push(marker);
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
