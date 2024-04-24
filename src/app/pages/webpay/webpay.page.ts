import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatePipe } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Info } from 'src/app/models/models';


@Component({ 
  selector: 'app-webpay',
  templateUrl: './webpay.page.html', 
  styleUrls: ['./webpay.page.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush  // Activando ChangeDetectionStrategy.OnPush
})
export class WebpayPage implements OnInit {
  info: Info | null = null; 

  constructor( 
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private firestoreService: FirestoreService,
    private afAuth: AngularFireAuth,
    private cd: ChangeDetectorRef  // Añadido ChangeDetectorRef para manejo manual de la detección de cambios
  ) {}

  ngOnInit() {}

  redirectToExternal(url: string) {
    window.location.href = url; // Redirecciona al usuario a la URL dada.
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}