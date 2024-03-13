import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';





interface ServicioData {
  coordenadasUsuario: { lat: number; lng: number; };
  nombreUsuario: string;
  uidUsuario: string;
  nombre: string;
  descripcion: string;
  uid: string;
}

// Define una interfaz para la estructura de tus documentos de producto
interface ProductoData {
  coordenadasUsuario: { lat: number; lng: number; };
  nombreUsuario: string;
  uidUsuario: string;
  nombre: string;
  descripcion: string;
  uid: string;
}



interface UserData {
  name: string;
  coordenadas: { lat: number, lng: number }; // Suponiendo que las coordenadas son un objeto con las propiedades lat y lng
  // Otros campos si los tienes
}
export interface ProductoConUsuario extends ProductoData {
  nombreUsuario: string;
  coordenadasUsuario: { lat: number; lng: number };
  
}
export interface ServicioConUsuario extends ProductoData {
  nombreUsuario: string;
  coordenadasUsuario: { lat: number; lng: number };
  
}


@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  paginaActual: string;
  terminoDeBusqueda: string = ''; // Declaración de la propiedad terminoDeBusqueda
  ubicacionSeleccionada: string;
  servicios: any [];
  productos: any[];
  productosEncontrados: { nombre: string, descripcion: string }[] = [];  
  serviciosEncontrados:  { nombre: string, descripcion: string }[] = [];
  tipoBusqueda: string = 'producto'; 
  



  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    ) {
      this.productosEncontrados = [];
      this.serviciosEncontrados = [];
  }
 

  ngOnInit() {
    this.buscarProductos();
    this.buscarServicios();
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
          console.log('el UID es', uidUsuario );
          servicioData.uidUsuario = uidUsuario;

          // Obtener el documento del usuario usando el UID
          this.firestore.collection('usuarios').doc(uidUsuario).get()
            .subscribe(usuarioDoc => {
              if (usuarioDoc.exists) {
                const usuarioData = usuarioDoc.data() as UserData;
                const coordenadasUsuario = usuarioData.coordenadas;

                // Guardar los datos relevantes en variables
                const nombreServicio = servicioData.nombre;
                const descripcionServicio = servicioData.descripcion;
                const nombreUsuario = usuarioData.name;

                // Navegar a la página de ubicación con los parámetros de consulta
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
          console.log('el UID es', uidUsuario );
          productoData.uidUsuario = uidUsuario;

          // Obtener el documento del usuario usando el UID
          this.firestore.collection('usuarios').doc(uidUsuario).get()
            .subscribe(usuarioDoc => {
              if (usuarioDoc.exists) {
                const usuarioData = usuarioDoc.data() as UserData;
                const coordenadasUsuario = usuarioData.coordenadas;

                // Guardar los datos relevantes en variables
                const nombreProducto = productoData.nombre;
                const descripcionProducto = productoData.descripcion;
                const nombreUsuario = usuarioData.name;

                // Navegar a la página de ubicación con los parámetros de consulta
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






mostrarMensajeError() {
  // Aquí puedes implementar la lógica para mostrar un mensaje de error al usuario
}


buscar() {
  if (this.tipoBusqueda === 'producto') {
    this.buscarProductos();
  } else if (this.tipoBusqueda === 'servicio') {
    this.buscarServicios();
  }
}





}







