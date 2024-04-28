import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, getIdToken } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'; // Importa funciones adicionales necesarias para Firestore
import { UserI } from '../models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private inactivityTimer: any;
  private inactivityDuration: number = 600000;

  constructor(private auth: AngularFireAuth, private router: Router) {
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
      this.router.navigate(['/login']);
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
  async signIn(user: UserI): Promise<UserI> {
    try {
      const result = await signInWithEmailAndPassword(getAuth(), user.email, user.password);
      if (result.user) {
        const userToken = await result.user.getIdToken();
        localStorage.setItem('userToken', userToken);

        // Simulación de la obtención de datos adicionales
        return {
          uid: result.user.uid,
          email: result.user.email,
          name: 'Nombre simulado', // Deberás obtener esto de Firestore o similar
          lastName: 'Apellido simulado',
          rut: '12345678-9',
          password: user.password,
          age: 30,
          numContact: 123456789,
          direccion: {
            calle: 'Calle simulada',
            numeroCalle: '123',
            ciudad: 'Ciudad simulada',
            pais: 'País simulado'
          },
          perfil: 'usuario',
          confirmaNumContact: 123456789,
          confirmaEmail: 'email@simulado.com',
          confirmaPassword: 'password',
          coordenadas: {
            lat: 123.456,
            lng: 123.456
          }
        };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
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
  signOut() {
    getAuth().signOut();
    this.router.navigate(['/']);
  }

  registrarUser(datos: UserI) {
    return this.auth.createUserWithEmailAndPassword(datos.email, datos.password);
  }

  // Obtener el documento del usuario de Firestore
  async getUserDoc(uid: string): Promise<any> {
    const db = getFirestore();
    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('No such document!');
    }
  }

  // Método para actualizar el planType en el documento del usuario
  async updatePlanType(uid: string, planType: string): Promise<void> {
    const db = getFirestore();
    const userDocRef = doc(db, 'usuarios', uid);
    return updateDoc(userDocRef, {
      planType: planType
    });
  }
}
