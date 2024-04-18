import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatePipe } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Info } from 'src/app/models/models';

declare var paypal: any;

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.page.html',
  styleUrls: ['./paypal.page.scss'], 
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaypalPage implements OnInit, AfterViewChecked {
  isPaymentCardEnabled: boolean = false;
  selectedPlanLabel: string = 'Sistemas de Pago';
  selectedPlanDuration: number = 0;
  info: Info | null = null;
  firestore: any;
  formattedTrialStartDate: string;
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
      scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=AYbtIBBzNywAhWQ91WXaFAfUpZthFdfnzHKf9SbFxoAUHLCHcfFv2GwmXsQC9QAIdo-ouj3Y6Yfem7nM';
      scriptElement.onload = resolve;
      scriptElement.onerror = () => reject('No se pudo cargar el script de PayPal');
      document.body.appendChild(scriptElement);
    });
  }

  initializePaypalButtons() {
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
            this.showConfirmation('¡Suscripción actualizada con éxito!');
          }).catch(error => {
            console.error('Error al actualizar la suscripción en Firestore', error);
            this.showConfirmation('Error al actualizar la suscripción en Firestore.');
          });
        });
      },
      onError: (err) => {
        console.error('Error en el pago', err);
        this.showConfirmation('Ocurrió un error durante el proceso de pago.');
      }
    }).render('#paypal-button-container');
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  showConfirmation(message: string) {
    alert(message);
  }
}
