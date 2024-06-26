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
  numContact: number;
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
  numContact: number;
}

interface UserData {
  name: string;
  numContact: number;
  coordenadas: { lat: number, lng: number }; // Suponiendo que las coordenadas son un objeto con las propiedades lat y lng
  // Otros campos si los tienes
}
interface CoordenadasReal {
  latitud: number;
  longitud: number;
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
  numeroContacto: any

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

  async buscarProductos() {
    if (!this.terminoDeBusqueda.trim()) {
      console.log('El término de búsqueda está vacío');
      return;
    }
  
    try {
      const querySnapshot = await this.firestore.collectionGroup('productos', ref => ref.where('nombre', '==', this.terminoDeBusqueda)).get().toPromise();
      for (const doc of querySnapshot.docs) {
        const productoData = doc.data() as ProductoData;
        const uidUsuario = doc.ref.parent.parent?.id;
        productoData.uidUsuario = uidUsuario;
  
        const usuarioDoc = await this.firestore.collection('usuarios').doc(uidUsuario).get().toPromise();
        if (!usuarioDoc.exists) {
          console.error('No se encontró el usuario con el UID:', uidUsuario);
          continue;
        }
  
        const usuarioData = usuarioDoc.data() as UserData;
        const coordenadasUsuario = usuarioData.coordenadas;
        const nombreProducto = productoData.nombre;
        const descripcionProducto = productoData.descripcion;
        const nombreUsuario = usuarioData.name;
        const numeroContacto = usuarioData.numContact;
  
        const coordenadasRealSnapshot = await this.firestore.collection(`usuarios/${uidUsuario}/coordenadasReal`).get().toPromise();
        let coordenadasReal = null;
        coordenadasRealSnapshot.forEach(doc => {
          coordenadasReal = doc.data(); // Assume last one if multiple
        });
  
        // Only redirect once, with all data
        this.router.navigate(['/ubication'], {
          queryParams: {
            nombreProducto,
            descripcionProducto,
            nombreUsuario,
            numeroContacto,
            coordenadasUsuario: JSON.stringify(coordenadasUsuario),
            coordenadasReal: JSON.stringify(coordenadasReal)
          }
        });
      }
    } catch (error) {
      console.error('Error al buscar productos:', error);
      this.mostrarMensajeError();
    }
  }
  
  async buscarServicios() {
    if (!this.terminoDeBusqueda.trim()) {
      console.log('El término de búsqueda está vacío');
      return;
    }
  
    try {
      const querySnapshot = await this.firestore.collectionGroup('servicios', ref => ref.where('nombre', '==', this.terminoDeBusqueda)).get().toPromise();
      for (const doc of querySnapshot.docs) {
        const servicioData = doc.data() as ServicioData;
        const uidUsuario = doc.ref.parent.parent?.id;
        servicioData.uidUsuario = uidUsuario;
  
        const usuarioDoc = await this.firestore.collection('usuarios').doc(uidUsuario).get().toPromise();
        if (!usuarioDoc.exists) {
          console.error('No se encontró el usuario con el UID:', uidUsuario);
          continue;
        }
  
        const usuarioData = usuarioDoc.data() as UserData;
        const coordenadasUsuario = usuarioData.coordenadas;
        const nombreServicio = servicioData.nombre;
        const descripcionServicio = servicioData.descripcion;
        const nombreUsuario = usuarioData.name;
        const numeroContacto = usuarioData.numContact;
  
        const coordenadasRealSnapshot = await this.firestore.collection(`usuarios/${uidUsuario}/coordenadasReal`).get().toPromise();
        let coordenadasReal = null;
        coordenadasRealSnapshot.forEach(doc => {
          coordenadasReal = doc.data(); // Assume last one if multiple
        });
  
        // Only redirect once, with all data
        this.router.navigate(['/ubication'], {
          queryParams: {
            nombreProducto: nombreServicio,
            descripcionProducto: descripcionServicio,
            nombreUsuario: nombreUsuario,
            numeroContacto: numeroContacto,
            coordenadasUsuario: JSON.stringify(coordenadasUsuario),
            coordenadasReal: JSON.stringify(coordenadasReal)
          }
        });
      }
    } catch (error) {
      console.error('Error al buscar servicios:', error);
      this.mostrarMensajeError();
    }
  }

  async buscarProductosEspecifica(coordenadasEspecifica: any) {
    if (!this.terminoDeBusqueda.trim()) {
      console.log('El término de búsqueda está vacío');
      return;
    }
  
    try {
      const querySnapshot = await this.firestore.collectionGroup('productos', ref => ref.where('nombre', '==', this.terminoDeBusqueda)).get().toPromise();
      
      for (const doc of querySnapshot.docs) {
        const productoData = doc.data() as ProductoData;
        const uidUsuario = doc.ref.parent.parent?.id;
        productoData.uidUsuario = uidUsuario;
  
        const usuarioDoc = await this.firestore.collection('usuarios').doc(uidUsuario).get().toPromise();
        
        if (usuarioDoc.exists) {
          const usuarioData = usuarioDoc.data() as UserData;
          const coordenadasUsuario = usuarioData.coordenadas;
          const nombreProducto = productoData.nombre;
          const descripcionProducto = productoData.descripcion;
          const nombreUsuario = usuarioData.name;
          const numeroContacto = usuarioData.numContact;
  
          // Obtener coordenadas reales
          const coordenadasRealSnapshot = await this.firestore.collection(`usuarios/${uidUsuario}/coordenadasReal`).get().toPromise();
          let coordenadasReal = null;
          coordenadasRealSnapshot.forEach(doc => {
            coordenadasReal = doc.data(); // Assume last one if multiple
          });
  
          this.router.navigate(['/ubication-especifica'], {
            queryParams: {
              nombreProducto: nombreProducto,
              descripcionProducto: descripcionProducto,
              nombreUsuario: nombreUsuario,
              coordenadasUsuario: JSON.stringify(coordenadasUsuario),
              numeroContacto: numeroContacto,
              coordenadasEspecifica: JSON.stringify(coordenadasEspecifica),
              coordenadasReal: JSON.stringify(coordenadasReal) // Agregar coordenadas reales
            }
          });
        } else {
          console.error('No se encontró el usuario con el UID:', uidUsuario);
        }
      }
    } catch (error) {
      console.error('Error al buscar productos:', error);
      this.mostrarMensajeError();
    }
  }
  

  async buscarServiciosEspecifica(coordenadasEspecifica: any) {
    if (!this.terminoDeBusqueda.trim()) {
      console.log('El término de búsqueda está vacío');
      return;
    }
  
    try {
      const querySnapshot = await this.firestore.collectionGroup('servicios', ref => ref.where('nombre', '==', this.terminoDeBusqueda)).get().toPromise();
      
      for (const doc of querySnapshot.docs) {
        const servicioData = doc.data() as ServicioData;
        const uidUsuario = doc.ref.parent.parent?.id;
        servicioData.uidUsuario = uidUsuario;
  
        const usuarioDoc = await this.firestore.collection('usuarios').doc(uidUsuario).get().toPromise();
        
        if (usuarioDoc.exists) {
          const usuarioData = usuarioDoc.data() as UserData;
          const coordenadasUsuario = usuarioData.coordenadas;
          const nombreServicio = servicioData.nombre;
          const descripcionServicio = servicioData.descripcion;
          const nombreUsuario = usuarioData.name;
          const numeroContacto = usuarioData.numContact;
  
          const coordenadasRealSnapshot = await this.firestore.collection(`usuarios/${uidUsuario}/coordenadasReal`).get().toPromise();
          let coordenadasReal = null;
          coordenadasRealSnapshot.forEach(doc => {
            coordenadasReal = doc.data(); // Assume last one if multiple
          });
  
          this.router.navigate(['/ubication-especifica'], {
            queryParams: {
              nombreProducto: nombreServicio,
              descripcionProducto: descripcionServicio,
              nombreUsuario: nombreUsuario,
              coordenadasUsuario: JSON.stringify(coordenadasUsuario),
              numeroContacto: numeroContacto,
              coordenadasEspecifica: JSON.stringify(coordenadasEspecifica),
              coordenadasReal: JSON.stringify(coordenadasReal)
            }
          });
        } else {
          console.error('No se encontró el usuario con el UID:', uidUsuario);
        }
      }
    } catch (error) {
      console.error('Error al buscar servicios:', error);
      this.mostrarMensajeError();
    }
  }
  
  buscar() {
  if (this.ubicacionSeleccionada === 'especifica') {
    if (this.direccionIngresada.trim() !== '') {
      this.obtenerCoordenadas(this.direccionIngresada.trim())
        .then(coordenadasEspecifica  => {
          if (this.tipoBusqueda === 'producto') {
            this.buscarProductosEspecifica(coordenadasEspecifica); 
          } else if (this.tipoBusqueda === 'servicio') {
            this.buscarServiciosEspecifica(coordenadasEspecifica);
          }       
        })
        .catch(error => {
          console.error(error);
          // Aquí puedes manejar el error, como mostrar un mensaje al usuario
        });
    } else {
      console.log('Debe ingresar una dirección');
    }
  } else if (this.ubicacionSeleccionada === 'actual') {
    // Si se selecciona la ubicación actual, iniciar la búsqueda directamente
    if (this.tipoBusqueda === 'producto') {
      this.buscarProductos(); // Pasar false para indicar que no se use ubicación específica
    } else if (this.tipoBusqueda === 'servicio') {
      this.buscarServicios();
    }
  } else {
    console.error('Seleccione una opción de ubicación válida');
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

  obtenerCoordenadasUsuarios() {
    this.firestore.collection('usuarios').get().subscribe(querySnapshot => {
      querySnapshot.forEach(usuarioDoc => {
        const uidUsuario = usuarioDoc.id;
        this.firestore.collection(`usuarios/${uidUsuario}/coordenadasReal`).get()
          .subscribe(coordenadasSnapshot => {
            coordenadasSnapshot.forEach(coordenadasDoc => {
              const coordenadas = coordenadasDoc.data();
              console.log('Coordenadas para el usuario con UID', uidUsuario, ':', coordenadas);
              // Aquí puedes hacer lo que necesites con las coordenadas
            });
          }, error => {
            console.error('Error al obtener las coordenadas para el usuario con UID', uidUsuario, ':', error);
          });
      });
    }, error => {
      console.error('Error al obtener los usuarios:', error);
    });
  }
  
  mostrarMensajeError() {
    // Implementa la lógica para mostrar un mensaje de error al usuario
  }

}
