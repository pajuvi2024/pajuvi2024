import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatePipe } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Info } from 'src/app/models/models';
import { Timestamp } from 'firebase/firestore';  // Importación correcta de Timestamp

declare var paypal: any;

@Component({
  selector: 'app-paypal2',
  templateUrl: './paypal2.page.html',
  styleUrls: ['./paypal2.page.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Paypal2Page implements OnInit, AfterViewChecked {
  isPaymentCardEnabled: boolean = false;
  selectedPlanLabel: string = 'Sistemas de Pago';
  selectedPlanDuration: number = 0;
  info: Info | null = null;
  formattedstartDate: string;
  formattedexpiryDate: string;
  private paypalScriptLoaded: boolean = false;
  selectedPlanValue: string = '1.00';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (!this.paypalScriptLoaded) {
      this.loadPaypalScript().then(() => {
        this.initializePaypalButtons();
      }).catch(error => {
        console.error('Error loading PayPal script:', error);
        this.showConfirmation('Error al cargar PayPal. Por favor, intente más tarde.');
      });
    } 
  }

  selectPlan(planLabel: string, planValue: string, planPrice: string, duration: number) {
    this.selectedPlanLabel = planLabel;
    this.isPaymentCardEnabled = true;
    this.selectedPlanValue = planPrice;
    this.selectedPlanDuration = duration;
    console.log(`Plan seleccionado: ${planLabel} con valor ${planValue} y precio ${planPrice}`);
  }

  loadPaypalScript(): Promise<any> {
    this.paypalScriptLoaded = true;
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=AYIHlNxMM19yv35I9DvL9wrSHgL_-URTpR_YTGJmdvBG9GG8j4ztfnN9OFMvovVFOinxUnYsApc1XMB3';
      scriptElement.onload = resolve;
      scriptElement.onerror = () => reject('No se pudo cargar el script de PayPal');
      document.body.appendChild(scriptElement);
    });
  }

  initializePaypalButtons() {
    paypal.Buttons({
        style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'paypal'
        },
        createOrder: (data, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: this.selectedPlanValue
                    }
                }]
            });
        },
        onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            this.handlePaymentSuccess(details);
        },
        onError: err => {
            console.error('Error en el pago', err);
            this.showConfirmation('Ocurrió un error durante el proceso de pago.');
        },
        onInit: (data, actions) => {
            actions.enable();
        }
    }).render('#paypal-button-container');
  }

  async handlePaymentSuccess(details) {
    const userId = (await this.afAuth.currentUser).uid;
    this.firestoreService.getDoc('usuarios', userId).subscribe((data: any) => {
        const user = data as Info;
        let newStartDate: Date;
        let newExpiryDate: Date = new Date(); 

        // Verificar si la fecha de inicio ya está establecida
        if (user && user.startDate) {
            newStartDate = user.startDate.toDate();  // Usar la fecha existente
        } else {
            newStartDate = new Date();  // Establecer la nueva fecha de inicio si no existe
        }

        // Configurar la nueva fecha de expiración
        if (user && user.expiryDate) {
            const currentExpiryDate = user.expiryDate.toDate();
            if (currentExpiryDate > new Date()) {
                // Si la expiración actual es futura, ajustar la nueva fecha de expiración en base a la actual
                newExpiryDate = new Date(currentExpiryDate);
            } else {
                // Si la expiración ha pasado, establecer la nueva expiración en base a hoy
                newExpiryDate = new Date(newStartDate);
            }
        }
        newExpiryDate.setMonth(newExpiryDate.getMonth() + this.selectedPlanDuration);

        const subscriptionData = {
            planType: this.selectedPlanLabel,
            startDate: Timestamp.fromDate(newStartDate), // Asegúrate de que solo se establezca en el primer pago
            expiryDate: Timestamp.fromDate(newExpiryDate),
            lastPaymentDetails: details
        };

        // Actualizar el documento del usuario con los nuevos valores
        this.firestoreService.updateDoc(`usuarios/${userId}`, subscriptionData)
            .then(() => {
                console.log('Datos de suscripción actualizados en Firestore');
                this.showConfirmation('¡Suscripción actualizada con éxito!');
            })
            .catch(error => {
                console.error('Error al actualizar la suscripción en Firestore', error);
                this.showConfirmation('Error al actualizar la suscripción en Firestore.');
            });
    }, error => {
        console.error('Error al obtener los datos del usuario:', error);
    });
}


  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  showConfirmation(message: string) {
    alert(message);
  }
}
