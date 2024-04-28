import { Component, OnInit } from '@angular/core';
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
    private toastController: ToastController,
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
        const user = await this.firebaseServ.signIn(this.form.value as UserI);
        const userDoc = await this.firebaseServ.getUserDoc(user.uid);
        if (userDoc && userDoc.expiryDate) {
          const expiryDate = new Date(userDoc.expiryDate.seconds * 1000);
          const currentDate = new Date();

          if (expiryDate <= currentDate) {
            // Show toast for expired subscription
            this.toastController.create({
              message: 'Suscripción expirada, elige tu mejor opción de pago',
              duration: 4000,
              color: 'primary',
              position: 'middle'
            }).then(toast => {
              toast.present();
              // Update planType to "Vencido" before navigating
              this.firebaseServ.updatePlanType(user.uid, "Vencido").then(() => {
                setTimeout(() => {
                  this.router.navigate(['/pago2']); // Redirect to payment screen after update
                }, 4000); // Wait for the toast message to complete before navigating
              });
            });
          } else {
            this.utilsServ.presentToast({
              message: 'Bienvenido: ' + user.email,
              duration: 3000,
              color: 'primary',
              position: 'middle',
              icon: 'alert-circle-sharp'
            });
            setTimeout(() => {
              this.router.navigate(['/main']); // Asumimos que 'main' es tu página principal
            }, 1000); // Esperamos 1 segundo antes de navegar
          }
        }
      } catch (error) {
        console.error(error);
        await this.utilsServ.presentToast({
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

    const toast = await this.toastController.create({
      message: 'Enlace copiado',
      duration: 2000
    });
    toast.present();
  }
}
