import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  paginaActual: string;


  constructor(
    private router: Router,
    private navCtrl: NavController
      
    
    ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url.split('/buscar')[1]; // Obtener el segmento de la URL
        this.paginaActual = url || 'buscar'; // Si la URL está vacía, establecer 'buscar' como valor predeterminado
      }
    });
  }
 

  ngOnInit() {
  }
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
}




cambiarPagina(event) {
  this.paginaActual = event.detail.value;
}


buscar(): void {
  // Obtener los valores seleccionados por el usuario
  const tipoBusqueda = ''; // Implementar la lógica para obtener el tipo de búsqueda
  const tipoUbicacion = ''; // Implementar la lógica para obtener el tipo de ubicación
  const terminoBusqueda = ''; // Implementar la lógica para obtener el término de búsqueda

  // Llamar a la función para buscar en la base de datos
  this.buscarEnBaseDeDatos(tipoBusqueda, tipoUbicacion, terminoBusqueda);
}

buscarEnBaseDeDatos(tipoBusqueda: string, tipoUbicacion: string, terminoBusqueda: string): void {
  // Aquí puedes llamar a un servicio para realizar la búsqueda en la base de datos
  // y luego navegar a la página de resultados
  this.navCtrl.navigateForward('/resultados', {
    queryParams: {
      tipoBusqueda,
      tipoUbicacion,
      terminoBusqueda
    }
  });
}


}

