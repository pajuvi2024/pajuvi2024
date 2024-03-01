import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MembresiaPage } from './membresia.page';

const routes: Routes = [
  {
    path: '',
    component: MembresiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MembresiaPageRoutingModule {}
