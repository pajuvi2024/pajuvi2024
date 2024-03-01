import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';


declare var paypal: any;

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  productos: any = [];

  constructor(private http: HttpClient) { }
  firebaseServ = inject(FirebaseService);
  router = inject(Router);

  ngOnInit() {
    this.getProductos().subscribe(res=>{
      console.log("Res", res)
      this.productos = res;
    }
    );

  }
  createPayPalOrder(amount: number) {
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount.toString(),
              },
            },
          ],
        });
      },
      onApprove: (data, actions) => {
        // Este callback se llama cuando el pago se aprueba con éxito
        return actions.order.capture().then((details) => {
          // Puedes realizar acciones adicionales aquí, como redirigir al usuario o mostrar un mensaje de confirmación
        });
      },
      onError: (err) => {
        // Este callback se llama si hay un error en el proceso de pago
        console.error(err);
      },
    }).render('#paypal-button-container');
  }
  getProductos(){
    return this.http
    .get("assets/productos/lista.json")
    .pipe(
      map((res:any) =>{
        return res.data;
      })
    )
  }



  userRole: string = 'usuario'; // Simula el rol del usuario (puedes obtenerlo de tu sistema de autenticación)
  

  // Función para verificar si el usuario tiene el rol "admin"
  isUserAdmin(): boolean {
    return this.userRole === 'admin';
  }
  


  signOut() {
    // Eliminar el token de autenticación de localStorage
    localStorage.removeItem('userToken');
    
    // Llamar al método de signOut de Firebase si es necesario
    this.firebaseServ.signOut();
    
    // Navegar a la página de inicio
    this.router.navigate(['/']);
  }

  openMain() {
    // Abre la página de "Ubicaciones" con un pequeño retraso
    setTimeout(() => {
      this.router.navigate(['/main']);
    }, 400); // 300 milisegundos (ajusta este valor según tus necesidades)
  }
  navigateTo(route: string) {
    this.router.navigateByUrl(route);
}

}
