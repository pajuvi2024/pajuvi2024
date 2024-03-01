import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroProductosPage } from './registro-productos.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroProductosPageRoutingModule {}
