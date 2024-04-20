import { Injectable } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { UserI } from '../models/models';
import { AngularFireAuth } from '@angular/fire/compat/auth';



@Injectable({
  providedIn: 'root'
})
export class UtilsService {
 

  constructor(private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private angularFireAuth: AngularFireAuth,
              private authfirebase: AngularFireAuth,
              ) { }


  loading(){
    return this.loadingCtrl.create({ spinner: 'crescent'})
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  registrarUser(datos: UserI){
    return this.authfirebase.createUserWithEmailAndPassword(datos.email, datos.password)
  
  } 

  async getUid(){
    const user = await this.authfirebase.currentUser;
    if (user){
      return user.uid;
    }else{
      return null;
    }
  }


}
