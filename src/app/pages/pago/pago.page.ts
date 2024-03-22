import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage implements OnInit {
  isPaymentCardEnabled: boolean = false;
  selectedPlanLabel: string = 'Sistemas de Pago';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadPaypalScript().then(() => {
      paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                currency_code: 'USD',
                value: '10.00' // Este valor se puede ajustar según el plan seleccionado
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            console.log('Pago realizado con éxito', details);
            // Aquí puedes implementar lo que sucede después de un pago exitoso
          });
        },
        onError: (err) => {
          console.error('Error en el pago', err);
          // Implementa tu manejo de errores aquí
        }
      }).render('#paypal-button-container');
    });
  }

  selectPlan(planLabel: string, planValue: string) {
    this.selectedPlanLabel = planLabel; // Actualiza el título con el plan seleccionado
    this.isPaymentCardEnabled = true; // Habilita la tarjeta de pago

    // Opcional: Aquí puedes agregar lógica adicional basada en el planValue, como ajustar el precio
    console.log(`Plan seleccionado: ${planLabel} con valor ${planValue}`);
  }

  loadPaypalScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=AeHcD0RMUXJX5x0NpSuhBehcxjgHpBEuAdPzK5BJlrZI_3SRSznrXC32VVNNIr-LJUHfWTrlDFTxnAS5&currency=USD';
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
