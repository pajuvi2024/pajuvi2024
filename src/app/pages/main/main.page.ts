import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MarcadorService } from './../../services/marcador.service';
import { GeoStateService } from 'src/app/services/geo-state.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';





@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  data: any;
  newVideoUrl: string = '';
  safeVideoUrl: SafeResourceUrl;

  intervalId: any; // Aquí se declara la propiedad intervalId
  obtenerCoordenadasHabilitado: boolean = false; // Bandera para indicar si la obtención de coordenadas está habilitada


  paginaActual: string;
  constructor(private afAuth: AngularFireAuth,              
              private router: Router,              
              private sanitizer: DomSanitizer,
              private marcadorService: MarcadorService,
              public geoStateService: GeoStateService,
              private firestore: AngularFirestore,
              private toastController: ToastController,
               
              
              
              ){
                this.intervalId = null;
                this.setVideoUrl('https://www.youtube.com/embed/06Btx0To5Dk?si=VCHegdQTOAMDSOCY');
                this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    const url = this.router.url.split('/main')[1]; // Obtener el segmento de la URL
                    this.paginaActual = url || 'buscar'; // Si la URL está vacía, establecer 'buscar' como valor predeterminado
                  }
                });

              }

  marcador: any[];



  async ngOnInit() {

    // Llama a getLocationAndSaveCoordinates() inicialmente
  await this.getLocationAndSaveCoordinates();

   // Establece un intervalo para llamar a getLocationAndSaveCoordinates() cada cierto período de tiempo (por ejemplo, cada 1 minuto)
   this.intervalId = setInterval(async () => {
    await this.getLocationAndSaveCoordinates();
  }, 1 * 60 * 1000); // 1 minuto en milisegundos
}

  setVideoUrl(url: string) {
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  changeVideo() {
    const videoId = this.extractVideoId(this.newVideoUrl);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      this.setVideoUrl(embedUrl);
    } else {
      console.error('No se pudo extraer el ID del video de la URL proporcionada.');
    }
  }

  extractVideoId(url: string): string | null {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }
  signOut() {
    // Eliminar el token de autenticación de localStorage
    localStorage.clear();

 
    
    this.afAuth.signOut().then(() => {
      // Cierre de sesión exitoso
      console.log('Sesión cerrada correctamente.');
      // Navegar a la página de inicio o a donde desees después del cierre de sesión
      this.router.navigate(['/login']); // Reemplaza 'login' con la ruta de tu página de inicio de sesión
    }).catch((error) => {
      console.error('Error al cerrar sesión: ', error);
    });
  }
 

  cambiarPagina(event) {
    this.paginaActual = event.detail.value;
  }



  async toggleGPS(event: any) {
    this.geoStateService.setGPSEnabled(event.detail.checked);
    if (event.detail.checked) {
      this.obtenerCoordenadasHabilitado = true; // Habilita la obtención de coordenadas
      this.getLocationAndSaveCoordinates(); // Llama a la función inicialmente
      // Establece un intervalo para llamar a getLocationAndSaveCoordinates() cada cierto período de tiempo (por ejemplo, cada 1 minuto)
      this.intervalId = setInterval(() => {
        this.getLocationAndSaveCoordinates();
      }, 1 * 60 * 1000); // 1 minuto en milisegundos
    } else {
      clearInterval(this.intervalId); // Limpia el intervalo cuando se desactiva el GPS
      this.obtenerCoordenadasHabilitado = false; // Deshabilita la obtención de coordenadas
      this.eliminarCoordenadas();
      console.log('Geolocalización desactivada');
    }
  }


  async getLocationAndSaveCoordinates() {
    // Verifica si la obtención de coordenadas está habilitada
    if (!this.obtenerCoordenadasHabilitado) {
      return; // Si no está habilitada, no hagas nada
    }

    try {
      const position = await this.getCurrentPosition();
      console.log('Latitude: ', position.coords.latitude, ' Longitude: ', position.coords.longitude);

      // Guardar la ubicación en la base de datos
      await this.guardarCoordenadas(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
    }
  }
  
  async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }
  
  async eliminarCoordenadas() {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        const coordenadasCollection = this.firestore.collection(`usuarios/${userId}/coordenadasReal`);

        // Obtener todas las coordenadas guardadas
        const snapshot = await coordenadasCollection.get().toPromise();

        // Eliminar cada documento de coordenadas
        snapshot.docs.forEach(async (doc) => {
          await doc.ref.delete();
        });

        const toast = await this.toastController.create({
          message: 'Coordenadas eliminadas exitosamente',
          position: 'middle',
          duration: 2000
        });
        toast.present();
      } else {
        console.error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al eliminar las coordenadas:', error);
      const toast = await this.toastController.create({
        message: 'Error al eliminar las coordenadas. Por favor, inténtalo de nuevo.',
        position: 'middle',
        duration: 2000
      });
      toast.present();
    }
  }
  

  async guardarCoordenadas(latitude: number, longitude: number) {
    try {
      const user = await this.afAuth.currentUser;
      if (user) {
        const userId = user.uid;
        const coordenadasCollection = this.firestore.collection(`usuarios/${userId}/coordenadasReal`);

        // Obtener el primer documento de coordenadas
        const snapshot = await coordenadasCollection.ref.limit(1).get();

        // Verificar si existen coordenadas previamente almacenadas
        if (!snapshot.empty) {
          // Obtener la referencia al primer documento
          const docRef = snapshot.docs[0].ref;

          // Actualizar las coordenadas del documento existente
          await docRef.update({
            latitude: latitude,
            longitude: longitude
          });

          console.log('Coordenadas actualizadas exitosamente');
        } else {
          // Si no hay documentos previos, agregar uno nuevo
          await coordenadasCollection.add({
            latitude: latitude,
            longitude: longitude
          });

          console.log('Coordenadas guardadas exitosamente');
        }

        const toast = await this.toastController.create({
          message: 'Coordenadas actualizadas exitosamente',
          position: 'middle',
          duration: 2000
        });
        toast.present();
      } else {
        console.error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al guardar las coordenadas:', error);
      const toast = await this.toastController.create({
        message: 'Error al guardar las coordenadas. Por favor, inténtalo de nuevo.',
        position: 'middle',
        duration: 2000
      });
      toast.present();
    }
  }
  
  
  
  
  }
