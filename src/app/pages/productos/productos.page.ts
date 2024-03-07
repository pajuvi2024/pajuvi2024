import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ItemReorderEventDetail } from '@ionic/angular';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {

  producto = {
    nombre: '',
    descripcion: ''
  };
  productos: any[] = [];
  productForm: FormGroup;
  agregarDeshabilitado: boolean = false;
  
  paginaActual: string;
  constructor( 
    private toastController: ToastController,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private router: Router
  ) { 
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url.split('/')[1]; // Obtener el segmento de la URL
        this.paginaActual = url || 'buscar'; // Si la URL está vacía, establecer 'buscar' como valor predeterminado
      }
    });
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log('Usuario autenticado:', user);
        this.obtenerProductos();
      } else {
        console.log('Usuario no autenticado.');
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Agregar Producto',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del Producto',
          attributes: {
            maxlength: 25
          }
        },
        { 
          name: 'descripcion',
          type: 'text',
          placeholder: 'Descripción del Producto (máx. 30 caracteres)',
            attributes: {
            maxlength: 50
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Guardar',
          cssClass: 'alert-button-confirm',
          handler: (data) => {
            this.guardarProducto(data.nombre, data.descripcion);
          }
        }
      ]
    });

    await alert.present();
  }

  async guardarProducto(nombre: string, descripcion: string) {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        const productosCollection = this.firestore.collection(`usuarios/${userId}/productos`);
        
        await productosCollection.add({
          nombre: nombre,
          descripcion: descripcion
        });
  
        const toast = await this.toastController.create({
          message: 'Producto guardado con éxito',
          position: 'middle',
          duration: 2000
        });
        toast.present();
      } else {
        console.error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error);
      const toast = await this.toastController.create({
        message: 'Error al guardar el producto. Por favor, inténtalo de nuevo.',
        duration: 2000
      });
      toast.present();
    }
  }

  obtenerProductos() {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const productosCollection = this.firestore.collection(`usuarios/${userId}/productos`);
  
        productosCollection.snapshotChanges().subscribe(actions => {
          this.productos = actions.map(a => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
          this.agregarDeshabilitado = this.productos.length >= 5;
        });
      } else {
        console.error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }

  

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  eliminarProducto(productoId: string) {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const productoRef = this.firestore.doc(`usuarios/${userId}/productos/${productoId}`);
        productoRef.delete().then(() => {
          console.log('Producto eliminado correctamente');
        }).catch((error) => {
          console.error('Error al eliminar producto:', error);
        });
      }
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
    }
  }
  async confirmarEliminarProducto(productoId: string) {
    const confirmacion = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Llamar a la función eliminarProducto si el usuario confirma
            this.eliminarProducto(productoId);
          }
        }
      ]
    });
  
    await confirmacion.present();
  }
  
  
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }
 

  cambiarPagina(event) {
    this.paginaActual = event.detail.value;
  }
}
  
  
  

