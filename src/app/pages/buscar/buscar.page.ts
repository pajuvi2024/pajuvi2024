import { Component, OnInit,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';


declare var google;

interface ServicioData {
  coordenadasUsuario: { lat: number; lng: number; };
  nombreUsuario: string;
  uidUsuario: string;
  nombre: string;
  descripcion: string;
  uid: string;
  coordenadas: { lat: number; lng: number; };
}

// Define una interfaz para la estructura de tus documentos de producto
interface ProductoData {
  coordenadasUsuario: { lat: number; lng: number; };
  nombreUsuario: string;
  uidUsuario: string;
  nombre: string;
  descripcion: string;
  uid: string;
  coordenadas: { lat: number; lng: number; };
}

interface UserData {
  name: string;
  coordenadas: { lat: number, lng: number }; // Suponiendo que las coordenadas son un objeto con las propiedades lat y lng
  // Otros campos si los tienes
}

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  paginaActual: string;
  terminoDeBusqueda: string = '';
  ubicacionSeleccionada: string;
  serviciosEncontrados: { nombre: string, descripcion: string }[] = [];
  productosEncontrados: { nombre: string, descripcion: string }[] = [];
  tipoBusqueda: string = 'producto';
  direccionIngresada: string = ''; 
  coordenadas: any;
  nombre: any;
  descripcion: any;
  name: any;

  constructor(
    private router: Router,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.ubicacionSeleccionada = 'actual';
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  cambiarPagina(event) {
    this.paginaActual = event.detail.value;
  }

  buscarServicios() {
    if (this.terminoDeBusqueda.trim() !== '') {
      this.firestore.collectionGroup('servicios', ref => ref.where('nombre', '==', this.terminoDeBusqueda))
        .get().subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            const servicioData = doc.data() as ServicioData;
            const uidUsuario = doc.ref.parent.parent?.id;
            servicioData.uidUsuario = uidUsuario;

            this.firestore.collection('usuarios').doc(uidUsuario).get()
              .subscribe(usuarioDoc => {
                if (usuarioDoc.exists) {
                  const usuarioData = usuarioDoc.data() as UserData;
                  const coordenadasUsuario = usuarioData.coordenadas;

                  const nombreServicio = servicioData.nombre;
                  const descripcionServicio = servicioData.descripcion;
                  const nombreUsuario = usuarioData.name;

                  this.router.navigate(['/ubication'], {
                    queryParams: {
                      nombreProducto: nombreServicio,
                      descripcionProducto: descripcionServicio,
                      nombreUsuario: nombreUsuario,
                      coordenadasUsuario: JSON.stringify(coordenadasUsuario)
                    }
                  });
                } else {
                  console.error('No se encontró el usuario con el UID:', uidUsuario);
                }
              }, error => {
                console.error('Error al obtener el usuario:', error);
              });
          });
        }, (error) => {
          console.error('Error al buscar servicios:', error);
          this.mostrarMensajeError();
        });
    } else {
      console.log('El término de búsqueda está vacío');
    }
  }

  buscarProductos() {
    if (this.terminoDeBusqueda.trim() !== '') {
      this.firestore.collectionGroup('productos', ref => ref.where('nombre', '==', this.terminoDeBusqueda))
        .get().subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            const productoData = doc.data() as ProductoData;
            const uidUsuario = doc.ref.parent.parent?.id;
            productoData.uidUsuario = uidUsuario;

            this.firestore.collection('usuarios').doc(uidUsuario).get()
              .subscribe(usuarioDoc => {
                if (usuarioDoc.exists) {
                  const usuarioData = usuarioDoc.data() as UserData;
                  const coordenadasUsuario = usuarioData.coordenadas;

                  const nombreProducto = productoData.nombre;
                  const descripcionProducto = productoData.descripcion;
                  const nombreUsuario = usuarioData.name;

                  this.router.navigate(['/ubication'], {
                    queryParams: {
                      nombreProducto: nombreProducto,
                      descripcionProducto: descripcionProducto,
                      nombreUsuario: nombreUsuario,
                      coordenadasUsuario: JSON.stringify(coordenadasUsuario)
                    }
                  });
                } else {
                  console.error('No se encontró el usuario con el UID:', uidUsuario);
                }
              }, error => {
                console.error('Error al obtener el usuario:', error);
              });
          });
        }, (error) => {
          console.error('Error al buscar productos:', error);
          this.mostrarMensajeError();
        });
    } else {
      console.log('El término de búsqueda está vacío');
    }
  }

  buscar() {
    if (this.ubicacionSeleccionada === 'especifica') {
      if (this.direccionIngresada.trim() !== '') {
        this.realizarBusquedaConDireccion();
      } else {
        console.log('Debe ingresar una dirección');
      }
    } else {
      // Si se selecciona la ubicación actual, iniciar la búsqueda directamente
      if (this.tipoBusqueda === 'producto') {
        this.buscarProductos();
      } else if (this.tipoBusqueda === 'servicio') {
        this.buscarServicios();
      }
    }
  }


  buscarEspecifica () {
    if (this.ubicacionSeleccionada === 'especifica') {
      if (this.direccionIngresada.trim() !== '') {
        this.realizarBusquedaConDireccion();
      } else {
        console.log('Debe ingresar una dirección');
      }
    } else {
      // Si se selecciona la ubicación actual, iniciar la búsqueda directamente
      if (this.tipoBusqueda === 'producto') {
        this.buscarProductos();
      } else if (this.tipoBusqueda === 'servicio') {
        this.buscarServicios();
      }
    }
  }


async realizarBusquedaConDireccion() {
  try {
    const coordenadas = await this.obtenerCoordenadas(this.direccionIngresada);
    console.log('Coordenadas obtenidas:', coordenadas);
    
    // Navegar a la página de ubication-especifica y pasar las coordenadas como parámetros
    this.router.navigate(['/ubication-especifica'], {
      queryParams: {
        lat: coordenadas.lat,
        lng: coordenadas.lng
      }
    });
  } catch (error) {
    console.error('Error al obtener coordenadas:', error);
    // Manejar el error y proporcionar retroalimentación al usuario si es necesario
  }
}
  

  async obtenerCoordenadas(direccion: string): Promise<{ lat: number, lng: number }> {
    return new Promise<{ lat: number, lng: number }>((resolve, reject) => {
      const geocoder = new google.maps.Geocoder
      ();
      geocoder.geocode({ 'address': direccion }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          const coordinates = { lat: location.lat(), lng: location.lng() };
          resolve(coordinates);
        } else {
          reject('No se pudieron obtener las coordenadas para la dirección proporcionada');
        }
      });
    });
  }

  async realizarBusquedaConCoordenadas(coordenadas: { lat: number, lng: number }) {
    if (this.tipoBusqueda === 'producto') {
      // Realiza la búsqueda de productos con las coordenadas proporcionadas
      // Actualiza this.productosEncontrados con los resultados de la búsqueda
    } else if (this.tipoBusqueda === 'servicio') {
      // Realiza la búsqueda de servicios con las coordenadas proporcionadas
      // Actualiza this.serviciosEncontrados con los resultados de la búsqueda
    }
  }

  mostrarMensajeError() {
    // Implementa la lógica para mostrar un mensaje de error al usuario
  }

}
