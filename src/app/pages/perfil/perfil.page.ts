import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UserI } from 'src/app/models/models';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';



@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'], 
})
export class PerfilPage implements OnInit {

  userData: any;
  apiUserData: any;
  userEmail: string;
  data: any;
  datos: any;
  uid: string = null;
  info: UserI = null;
  selectedFile: File = null;
  selectedFileUrl: SafeUrl | undefined;
  storageIonic: Storage | null = null; // Declarar la propiedad

  constructor(
    private Auth: AngularFireAuth,
    private alertController: AlertController,    
    private firestore: FirestoreService,
    private utilsService: UtilsService,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private storage: Storage,
    private afStorage: AngularFireStorage,
    private router: Router,
    private afAuth: AngularFireAuth,
  
    
    
             
  ) {}


  async ngOnInit() {
    console.log('Estoy en perfil');
    await this.initStorage();
    this.getUid();
    // Obtener la URL almacenada
    const storedImageUrl = await this.storage.get('profileImageUrl');
    // Si existe una URL almacenada, asignarla a selectedFileUrl
    if (storedImageUrl) {
      this.selectedFileUrl = storedImageUrl;
    }
  }
  
  
  async initStorage() {
    await this.storage.create();
  }
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
}

 

  getUsuario() {
    this.firestore.getCollection();
  }

  async getUid() {
    const uid = await this.utilsService.getUid();
    if (uid) {
      this.uid = uid;
      console.log('uid->', this.uid);
      this.getInfoUser();
    } else {
      console.log('no existe uid');
    }
  }

  getInfoUser() {
    const path = 'usuarios';
    const id = this.uid;
    this.firestore.getDoc(path, id).subscribe(res => {
      if (res) {
        this.info = res;
      } 
      console.log('datos ->', res);
    });
  }

  public alertButtons = ['Actualizar'];
  public alertInputs = [
    {
      placeholder: 'Correo electrónico',
    }
  ];

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.selectedFileUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
    }
  }

  async uploadImage() {
    const storageRef = this.afStorage.ref('images/' + this.selectedFile.name);
    const uploadTask = storageRef.put(this.selectedFile);
    uploadTask.snapshotChanges().subscribe(
      async (snapshot) => {
        // Se ejecuta durante la carga
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        // Se ejecuta si hay un error durante la carga
        console.error('Upload failed: ', error);
      }, 
      async () => {
        // Se ejecuta cuando la carga se completa con éxito
        console.log('Upload successful!');
        // Obtiene la URL de la imagen cargada
        const imageUrl = await storageRef.getDownloadURL().toPromise();
        // Establece selectedFileUrl
        this.selectedFileUrl = imageUrl;
        // Almacena la URL en el almacenamiento local
        await this.storage.set('profileImageUrl', imageUrl);
      }
    );
  }
  

  async getImage() {
    const storageRef = this.afStorage.ref('images/' + this.selectedFile.name);
    try {
      // Obtener la URL de la imagen
      const imageUrl = await storageRef.getDownloadURL().toPromise();
      // Asignar la URL a selectedFileUrl
      this.selectedFileUrl = imageUrl;
    } catch (error) {
      console.error('Error al obtener la imagen del almacenamiento:', error);
      // Manejar el error según sea necesario
    }
  }
  




  selectImage() {
    document.getElementById('fileInput').click();
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
  
  handleRefresh(event) {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

}
  