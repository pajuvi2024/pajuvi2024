import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';


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

export class PagoPage implements OnInit, AfterViewChecked {
  isPaymentCardEnabled: boolean = false;
  selectedPlanLabel: string = 'Sistemas de Pago';
  info: Info | null = null;
  firestore: any;
  formattedTrialStartDate: string;
  formattedstartDate: string;
  formattedexpiryDate: string;
  private paypalScriptLoaded: boolean = false; // Añadido para controlar la carga del script de PayPal

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
  }

  ngAfterViewChecked(): void {
    if (!this.paypalScriptLoaded) {
      this.loadPaypalScript().then(() => {
        paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  currency_code: 'USD',
                  value: '1.00' // Este valor se puede ajustar dinámicamente según el plan seleccionado
                }
              }]
            });
          },

          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              console.log('Pago realizado con éxito', details);
              // Implementa lo que sucede después de un pago exitoso, como actualizar la base de datos o mostrar una confirmación al usuario
            });
          },
          onError: (err) => {
            console.error('Error en el pago', err);
            // Implementa tu manejo de errores aquí
          }
        }).render('#paypal-button-container');
      });
    }
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
    this.paypalScriptLoaded = true;
    return new Promise(resolve => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=AYbtIBBzNywAhWQ91WXaFAfUpZthFdfnzHKf9SbFxoAUHLCHcfFv2GwmXsQC9QAIdo-ouj3Y6Yfem7nM';
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}