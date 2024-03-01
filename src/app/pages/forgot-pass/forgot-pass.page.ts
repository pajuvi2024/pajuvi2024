import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserI } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  firebaseServ = inject(FirebaseService);
  utilsServ = inject(UtilsService);
  router = inject(Router);
  constructor() { }

  ngOnInit() {
  }

  async submit() {

    if (this.form.valid) {
      const loading = await this.utilsServ.loading();
      await loading.present();

      this.firebaseServ.sendRecoveryEmail(this.form.value.email).then(res => {
        this.utilsServ.presentToast({
          message: 'Correo enviado a ' + this.form.value.email,
          duration: 3000,
          color: "primary",
          position: "middle",
          icon: "alert-circle-sharp"
        });
        this.router.navigate(['/login']);
        this.form.reset();
      }).catch(error => {
        console.log(error);
        
        this.utilsServ.presentToast({
          message: error.message,
          duration: 3000,
          color: "primary",
          position: "middle",
          icon: "alert-circle-sharp"
        })
      }).finally(() => {
        loading.dismiss();
      })
    }
  }
  back() {
    this.router.navigate(['/']);
  }

}
