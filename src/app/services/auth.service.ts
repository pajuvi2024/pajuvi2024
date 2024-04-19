import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ApiService } from 'src/app/services/api.service';;
import { UserI } from '../models/models';
import { AngularFireAuth } from '@angular/fire/compat/auth';



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

  constructor(
    private firebaseServ: FirebaseService,
    private utilsServ: UtilsService,
    private router: Router,
    private authfirebase: AngularFireAuth,
    
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
          message: 'Bienvenidooo: ' + this.form.value.email,
          duration: 3000,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-sharp'
        });

        // Introduce un retraso adicional de 1 segundo (total de 4 segundos) antes de navegar a la página 'main'
        setTimeout(() => {
          this.router.navigate(['/main']);
        }, 1000);
      }, 3000); // 3000 milisegundos (3 segundos)
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

registrarUser(datos: UserI){
  return this.authfirebase.createUserWithEmailAndPassword(datos.email, datos.password)

} 

}
