import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UserI } from 'src/app/models/models';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  link: string = 'https://www.instagram.com/vyc.tiendaonline/';

  constructor(
    private firebaseServ: FirebaseService,
    private utilsServ: UtilsService,
    private router: Router,
    private ToastController: ToastController,
  ) { }

  ngOnInit() {
    localStorage.removeItem('userToken');

    localStorage.removeItem('userEmail');

    
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsServ.loading();
      await loading.present();

      try {
        await this.firebaseServ.signIn(this.form.value as UserI);

         // Introduce un retraso de 3 segundos antes de mostrar el Toast
      setTimeout(() => {
        this.utilsServ.presentToast({
          message: 'Bienvenido: ' + this.form.value.email,
          duration: 3000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-sharp'
        });

        // Introduce un retraso adicional de 1 segundo (total de 4 segundos) antes de navegar a la página 'main'
        setTimeout(() => {
          
        }, 1000);
      }, 1000); // 3000 milisegundos (3 segundos)
      } catch (error) {
        console.log(error);
        this.utilsServ.presentToast({
          message: 'Error en el usuario y/o contraseña',
          duration: 3000,
          color: "primary",
          position: "middle",
          icon: "alert-circle-sharp"
        });
      } finally {
        loading.dismiss();
      }
    }
  }





    
    actionSheetButtons = [
      {
        text: 'Copiar enlace',
        icon: 'link', 
        handler: () => {
          this.copyLinkToClipboard();
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ];
    

  async copyLinkToClipboard() {
    const el = document.createElement('textarea');
    el.value = this.link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    const toast = await this.ToastController.create({
      message: 'Enlace copiado',
      duration: 2000
    });
    toast.present();
  }
}
