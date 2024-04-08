import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface Info {
  planType: string;
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
  selectedPlanDuration: number = 0;  // Duración en meses del plan seleccionado
  info: Info | null = null;
  firestore: any;
  formattedTrialStartDate: string;
  formattedstartDate: string;
  formattedexpiryDate: string;
  private paypalScriptLoaded: boolean = false;
  selectedPlanValue: string = '1.00';

  constructor(private router: Router, private datePipe: DatePipe, private firestoreService: FirestoreService, private afAuth: AngularFireAuth) {
    this.firestore = firestoreService;
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.cargarDatosDeFirestore(userId);
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
                  value: this.selectedPlanValue
                }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(async details => {
                console.log('Pago realizado con éxito', details);
        
                const userId = (await this.afAuth.currentUser).uid;
        
                const expiryDate = new Date();
                expiryDate.setMonth(expiryDate.getMonth() + this.selectedPlanDuration);

                const subscriptionData = {
                    planType: this.selectedPlanLabel,
                    startDate: new Date(),
                    expiryDate: expiryDate,
                    lastPaymentDetails: details
                };
        
                this.firestore.updateDoc(`usuarios/${userId}`, subscriptionData).then(() => {
                  console.log('Datos de suscripción actualizados en Firestore');
                  this.showConfirmation();
                }).catch(error => {
                  console.error('Error al actualizar la suscripción en Firestore', error);
                });
              
            });
          },
        
          onError: (err) => {
            console.error('Error en el pago', err);
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
    }, error => {
      console.error('Error al recuperar documento:', error);
    });
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  selectPlan(planLabel: string, planValue: string, planPrice: string, duration: number) {
    this.selectedPlanLabel = planLabel;
    this.isPaymentCardEnabled = true;
    this.selectedPlanValue = planPrice;
    this.selectedPlanDuration = duration; // Establecer la duración del plan seleccionado
    console.log(`Plan seleccionado: ${planLabel} con valor ${planValue} y precio ${planPrice}`);
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

  showConfirmation() {
    alert('¡Gracias por tu pago! Tu suscripción ha sido activada.');
  }
}
