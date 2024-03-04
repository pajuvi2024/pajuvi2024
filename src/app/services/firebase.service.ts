import { Injectable} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, getIdToken } from 'firebase/auth';
import { UserI } from '../models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  buscarProductos // Actualizar el perfil del usuario en Firebase
    () {
    throw new Error('Method not implemented.');
  }

  private inactivityTimer: any;
  private inactivityDuration: number = 600000; 


  constructor(private auth: AngularFireAuth,
             private router: Router) {
    this.initializeInactivityTimer();
  }

  // Método para inicializar el temporizador de inactividad
  private initializeInactivityTimer() {
    this.resetInactivityTimer();
    window.addEventListener('mousemove', () => this.resetInactivityTimer());
    window.addEventListener('keydown', () => this.resetInactivityTimer());
  }

  // Método para reiniciar el temporizador de inactividad
  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      // Eliminar el token del localStorage
      localStorage.removeItem('userToken');
      // Redirigir al usuario al inicio de sesión
      this.router.navigate(['/login']); // Cambia '/login' por la ruta de inicio de sesión
    }, this.inactivityDuration);
  }



  // Obtener la instancia de autenticación de Firebase
  getAuth() {
    return getAuth();
  }

  // Registrarse en Firebase
  signUp(user: UserI) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

   // Iniciar sesión en Firebase
   async signIn(user: UserI): Promise<void> {
    try {
      const result = await signInWithEmailAndPassword(getAuth(), user.email, user.password);
      if (result.user) {
        // Inicio de sesión exitoso
        // Accede al token JWT
        const userToken = await result.user.getIdToken();


  
        // Guarda el token en localStorage para su posterior uso
        localStorage.setItem('userToken', userToken);


        
        
        // Navega nuevamente a la página 'main' para recargarla
        this.router.navigateByUrl('/main');
        
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error; // Lanza el error para que se maneje en el componente
    }
  }
  // Actualizar el perfil del usuario en Firebase
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  // Enviar correo electrónico de recuperación de contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // Cerrar sesión en Firebase
  signOut(){
    getAuth().signOut();
    this.router.navigate(['/']);
  }

registrarUser(datos: UserI){
  return this.auth.createUserWithEmailAndPassword(datos.email, datos.password)
}

}
