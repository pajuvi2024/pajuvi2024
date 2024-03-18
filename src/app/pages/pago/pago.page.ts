import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var paypal: any; // Declara la variable 'paypal' para que TypeScript no marque errores

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.loadPaypalScript().then(() => {
      paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: '10.00' // Puedes modificar este valor según el monto a pagar
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            console.log('Pago realizado con éxito', details);
            // Aquí puedes agregar lo que deseas hacer una vez que el pago se haya completado con éxito
          });
        },
        onError: (err) => {
          console.log(err);
          // Manejo de errores
        }
      }).render('#paypal-button-container'); // Indica el contenedor donde se renderizará el botón de PayPal
    });
  }

  loadPaypalScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=AeHcD0RMUXJX5x0NpSuhBehcxjgHpBEuAdPzK5BJlrZI_3SRSznrXC32VVNNIr-LJUHfWTrlDFTxnAS5'; // Reemplaza 'TU_CLIENT_ID' con tu client ID real
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
