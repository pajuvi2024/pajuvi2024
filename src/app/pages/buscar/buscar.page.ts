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


interface Producto {
  nombre: string;
  descripcion: string;
}
interface Servicio {
  nombre: string;
  descripcion: string;
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
      this.serviciosEncontrados = servicios;
    }, (error) => {
      console.error('Error al buscar servicios:', error);
       //Puedes mostrar un mensaje de error al usuario si lo deseas
      this.mostrarMensajeError();
    });
}

buscarProductos() {
  this.firestoreService.buscarProductos().subscribe((data: Producto[]) => {
    this.productos = data;
    this.productosEncontrados = data;
  });
}


buscarProducto(terminoDeBusqueda: string) {
  // Realiza la búsqueda en la colección 'usuarios' en la base de datos de Firebase utilizando AngularFirestore
  this.firestore.collectionGroup('productos', ref => ref.where('nombre', '==', terminoDeBusqueda)).valueChanges().subscribe((productos: Producto[]) => {
    // La variable 'productos' contendrá los resultados de la búsqueda
    console.log('Productos encontrados:', productos);
    // Asigna los resultados a una variable para que puedan ser mostrados en la interfaz de usuario
    this.productosEncontrados = productos;
  }, (error) => {
    // Maneja el error en caso de que ocurra durante la búsqueda
    console.error('Error al buscar productos:', error);
    // Puedes mostrar un mensaje de error al usuario si lo deseas
    this.mostrarMensajeError();
  });
}
buscarServicio(terminoDeBusqueda: string) {
  // Realiza la búsqueda en la colección 'usuarios' en la base de datos de Firebase utilizando AngularFirestore
  this.firestore.collectionGroup('servicios', ref => ref.where('nombre', '==', terminoDeBusqueda)).valueChanges().subscribe((servicios: Servicio[]) => {
    // La variable 'productos' contendrá los resultados de la búsqueda
    console.log('Serviicios encontrados:', servicios);
    // Asigna los resultados a una variable para que puedan ser mostrados en la interfaz de usuario
    this.serviciosEncontrados = servicios;
  }, (error) => {
    // Maneja el error en caso de que ocurra durante la búsqueda
    console.error('Error al buscar productos:', error);
    // Puedes mostrar un mensaje de error al usuario si lo deseas
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







