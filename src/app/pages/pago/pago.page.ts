import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.page.html',
  styleUrls: ['./pago.page.scss'],
})
export class PagoPage {
  constructor(private router: Router) { }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
} 
