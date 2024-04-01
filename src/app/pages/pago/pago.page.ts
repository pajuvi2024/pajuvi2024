import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service'; // Importa tu servicio Firestore
import { DatePipe } from '@angular/common'; // Importa DatePipe
import { Timestamp } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Asegúrate de importar AngularFireAuth


// Asegúrate de tener la interfaz Info definida o importada
interface Info {
  planType: string; // Ajusta el tipo según el formato de tus datos en Firestore
  trialStartDate: Timestamp;
  startDate: Timestamp;
  expiryDate: Timestamp;
}

declare var paypal: any;

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
  providers: [DatePipe]
})


export class PagoPage implements OnInit {
  isPaymentCardEnabled: boolean = false;
  selectedPlanLabel: string = 'Sistemas de Pago';
  info: Info | null = null; // Propiedad para almacenar los datos recuperados
  firestore: any;
  formattedTrialStartDate: string;
  formattedstartDate: string;
  formattedexpiryDate: string;

  constructor(private router: Router, private datePipe: DatePipe, private firestoreService: FirestoreService, private afAuth: AngularFireAuth) {
    this.firestore = firestoreService;
    
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Aquí tienes el ID del usuario autenticado
        const userId = user.uid;
        // Ahora puedes cargar los datos de Firestore para este usuario
        this.cargarDatosDeFirestore(userId);
      } else {
        // El usuario no está autenticado, manejar según sea necesario
      }
    });
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


  cargarDatosDeFirestore(userId: string) {
    const path = 'usuarios';
    this.firestore.getDoc(path, userId).subscribe(res => {
      if (res) {
        this.info = res;
        this.formattedTrialStartDate = this.formatDate(this.info.trialStartDate.toDate());
        this.formattedstartDate = this.formatDate(this.info.startDate.toDate());
        this.formattedexpiryDate = this.formatDate(this.info.expiryDate.toDate());
      } else {
        console.log('Documento no encontrado');
      }
      console.log('datos ->', res);
    }, error => {
      console.error('Error al recuperar documento:', error);
    });
  }


    formatDate(date: Date): string {
      return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
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
