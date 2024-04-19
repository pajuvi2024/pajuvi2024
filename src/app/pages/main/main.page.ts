import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  data: any;
  newVideoUrl: string = '';
  safeVideoUrl: SafeResourceUrl;

  paginaActual: string;
  constructor(private afAuth: AngularFireAuth,              
              private router: Router,              
              private sanitizer: DomSanitizer,
              ){
                this.setVideoUrl('https://www.youtube.com/embed/06Btx0To5Dk?si=VCHegdQTOAMDSOCY');
                this.router.events.subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    const url = this.router.url.split('/main')[1]; // Obtener el segmento de la URL
                    this.paginaActual = url || 'buscar'; // Si la URL está vacía, establecer 'buscar' como valor predeterminado
                  }
                });

              }

  marcador: any[];



  async ngOnInit() {}

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

  toggleGPS(event: any) {
    // Aquí puedes implementar la lógica para activar o desactivar la geolocalización
    if (event.detail.checked) {
      // Si el toggle está activado
      console.log('Geolocalización activada');
      // Llamar a la función para obtener la ubicación
      this.getLocation();
    } else {
      // Si el toggle está desactivado
      console.log('Geolocalización desactivada');
      // Aquí podrías detener la obtención de la ubicación o realizar otras acciones necesarias
    }
  }

  getLocation() {
    // Aquí puedes implementar la lógica para obtener la ubicación
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('Latitude: ' + position.coords.latitude + ' Longitude: ' + position.coords.longitude);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }


  
  }
