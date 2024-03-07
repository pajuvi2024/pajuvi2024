import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { take } from 'rxjs/operators';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';


interface Producto {
  uid: any;
  nombre: string;
  descripcion: string;
  idUsuario: string; // Agrega esta propiedad si tus productos tienen un ID de usuario asociado
  latitud: number; // Agrega esta propiedad si tus productos tienen una latitud
  longitud: number; // Agrega esta propiedad si tus productos tienen una longitud
}

interface Servicio {
  uid: any;
  nombre: string;
  descripcion: string;
  idUsuario: string; // Agrega esta propiedad si tus servicios tienen un ID de usuario asociado
  latitud: number; // Agrega esta propiedad si tus servicios tienen una latitud
  longitud: number; // Agrega esta propiedad si tus servicios tienen una longitud
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
  servicios: Servicio[] = [];
  productos: any[];
  productosEncontrados: { nombre: string, descripcion: string }[] = [];  
  serviciosEncontrados:  { nombre: string, descripcion: string }[] = [];
tipoBusqueda: string = 'producto'; 
  

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController,
    private firestoreService: FirestoreService,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    ) {
      
  }
 

  ngOnInit() {
    this.buscarProductos();
    this.buscarServicios();
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
}

cambiarPagina(event) {
  this.paginaActual = event.detail.value;
}

buscarServicios() {
  this.firestore.collectionGroup('servicios', ref => ref.where('nombre', '==', this.terminoDeBusqueda))
    .valueChanges().subscribe((servicios: Servicio[]) => {
      console.log('Servicios encontrados:', servicios);
      this.serviciosEncontrados = servicios;
      
      servicios.forEach(servicio => {
        // Obtener el UID del usuario del servicio
        const uidUsuario = servicio.uid; // Ajusta según la estructura real de tu base de datos
        console.log('UID del usuario:', uidUsuario);
        
        // Buscar el usuario usando el UID obtenido
        this.firestore.collection('usuarios').doc(uidUsuario).valueChanges().subscribe((usuario: any) => {
          console.log('Usuario encontrado:', usuario);
          if (usuario && usuario.name && usuario.coordenadas && usuario.coordenadas.lat && usuario.coordenadas.lng) {
            console.log('Nombre del usuario:', usuario.name);
            console.log('Coordenadas del usuario:', usuario.coordenadas.lat, usuario.coordenadas.lng);
          } else {
            console.log('El usuario o sus propiedades son indefinidas');
          }
        });
      });
    }, (error) => {
      console.error('Error al buscar servicios:', error);
      this.mostrarMensajeError();
    });
}

buscarProductos() {
  this.firestore.collectionGroup('productos', ref => ref.where('nombre', '==', this.terminoDeBusqueda))
    .valueChanges().subscribe((productos: Producto[]) => {
      console.log('Productos encontrados:', productos);
      this.productosEncontrados = productos;
      
      productos.forEach(producto => {
        // Obtener el UID del usuario del producto
        const uidUsuario = producto.uid; // Ajusta según la estructura real de tu base de datos
        console.log('UID del usuario:', uidUsuario);
        
        // Buscar el usuario usando el UID obtenido
        this.firestore.collection('usuarios').doc(uidUsuario).valueChanges().subscribe((usuario: any) => {
          console.log('Usuario encontrado:', usuario);
          if (usuario && usuario.name && usuario.coordenadas && usuario.coordenadas.lat && usuario.coordenadas.lng) {
            console.log('Nombre del usuario:', usuario.name);
            console.log('Coordenadas del usuario:', usuario.coordenadas.lat, usuario.coordenadas.lng);
          } else {
            console.log('El usuario o sus propiedades son indefinidas');
          }
        });
      });
    }, (error) => {
      console.error('Error al buscar productos:', error);
      this.mostrarMensajeError();
    });
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







