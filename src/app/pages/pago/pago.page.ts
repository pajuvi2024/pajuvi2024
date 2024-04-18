import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatePipe } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface Info {
  planType: string;
  startDate: Timestamp;
  expiryDate: Timestamp;
}

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush  // Activando ChangeDetectionStrategy.OnPush
})
export class PagoPage implements OnInit {
  info: Info | null = null;
  formattedstartDate: string;
  formattedexpiryDate: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth,
    private cd: ChangeDetectorRef  // Añadido ChangeDetectorRef para manejo manual de la detección de cambios
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.cargarDatosDeFirestore(user.uid);
      }
    });
  }

  cargarDatosDeFirestore(userId: string) {
    const path = 'usuarios';
    this.firestoreService.getDoc(path, userId).subscribe(res => {
      const validData = this.validarDatosUsuario(res);
      if (validData) {
        this.info = validData;
        this.formattedstartDate = this.formatDate(this.info.startDate.toDate());
        this.formattedexpiryDate = this.formatDate(this.info.expiryDate.toDate());
        this.cd.detectChanges();  // Detecta cambios manualmente después de actualizar los datos
      } else {
        console.log('Documento no encontrado o datos inválidos');
      }
    }, error => {
      console.error('Error al recuperar documento:', error);
    });
  }

  validarDatosUsuario(data: any): Info | null {
    if (data && typeof data.planType === 'string' && data.startDate && data.expiryDate) {
      return {
        planType: data.planType,
        startDate: data.startDate,
        expiryDate: data.expiryDate
      };
    } else {
      console.error('Datos de usuario inválidos:', data);
      return null;
    }
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
