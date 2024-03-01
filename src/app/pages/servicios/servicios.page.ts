import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  servicio = {
    nombre: '',
    descripcion: ''
  };
  servicios: any[] = [];
  serviForm: FormGroup;
  agregarDeshabilitado: boolean = false;
  paginaActual: string;

  usuarioAutenticado: any;

  constructor(
    private toastController: ToastController,
    private firestoreService: FirestoreService,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.serviForm = this.formBuilder.group({
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
        this.obtenerServicios();
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
      header: 'Agregar Servivio',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del Servicio',
          attributes: {
            maxlength: 25
          }
        },
        {
          name: 'descripcion',
          type: 'text',
          placeholder: 'Descripción del servicio (máx. 30 caracteres)',
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
            this.guardarServicio(data.nombre, data.descripcion);
          }
        }
      ]
    });

    await alert.present();
  }

  async guardarServicio(nombre: string, descripcion: string) {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        const serviciosCollection = this.firestore.collection(`usuarios/${userId}/servicios`);
        
        await serviciosCollection.add({
          nombre: nombre,
          descripcion: descripcion
        });
  
        const toast = await this.toastController.create({
          message: 'Servicio guardado con éxito',
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

  async obtenerServicios() {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const serviciosCollection = this.firestore.collection(`usuarios/${userId}/servicios`);

        serviciosCollection.snapshotChanges().subscribe(actions => {
          this.servicios = actions.map(a => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
          this.agregarDeshabilitado = this.servicios.length >= 3;
        });
      } else {
        console.error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  

  async eliminarServicio(servicioId: string) {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;
        const servicioRef = this.firestore.doc(`usuarios/${userId}/servicios/${servicioId}`);
        await servicioRef.delete();
        this.presentToast('Servicio eliminado correctamente');
      }
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      this.presentToast('Error al eliminar el servicio. Por favor, inténtalo de nuevo.');
    }
  }

  async confirmarEliminarServicio(servicioId: string) {
    const confirmacion = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este servicio?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            // Llamar a la función eliminarProducto si el usuario confirma
            this.eliminarServicio(servicioId);
          }
        }
      ]
    });
  
    await confirmacion.present();
  }
  cambiarPagina(event) {
    this.paginaActual = event.detail.value;
  }

  

}
