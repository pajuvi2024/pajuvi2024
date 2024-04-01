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

    // Agregar marcador en las coordenadas
    const marker = new google.maps.Marker({
      position: coordenadas,
      map: this.map,
      title: 'Ubicación'
    });

    this.markers.push(marker);
  }


  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
