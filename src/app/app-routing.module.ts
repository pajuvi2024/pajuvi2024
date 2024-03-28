import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { LoadingComponent } from './shared/componentes/loading/loading.component';


const routes: Routes = [
  {
    path: 'loading',
    component: LoadingComponent // Carga el componente directamente
  },
  {
    path: '',
    redirectTo: 'loading',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule), canActivate:[NoAuthGuard]
  },
  {
    path: 'forgot-pass',
    loadChildren: () => import('./pages/forgot-pass/forgot-pass.module').then( m => m.ForgotPassPageModule),canActivate:[NoAuthGuard]
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule), canActivate:[NoAuthGuard]
  },
  {
    path: 'ubication',
    loadChildren: () => import('./pages/ubication/ubication.module').then( m => m.UbicationPageModule), canActivate:[AuthGuard]
  },
  {
    path: 'main',
    loadChildren: () => import('./pages/main/main.module').then( m => m.MainPageModule),canActivate: [AuthGuard]
  },  
  {
    path: 'pago',
    loadChildren: () => import('./pages/pago/pago.module').then( m => m.PagoPageModule),canActivate:[AuthGuard]
  },
  
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'registro-productos',
    loadChildren: () => import('./pages/registro-productos/registro-productos.module').then( m => m.RegistroProductosPageModule)
  },
  {
    path: 'registro-servicios',
    loadChildren: () => import('./pages/registro-servicios/registro-servicios.module').then( m => m.RegistroServiciosPageModule)
  },
  {
    path: 'registro-productos',
    loadChildren: () => import('./pages/registro-productos/registro-productos.module').then( m => m.RegistroProductosPageModule)
  },
  {
    path: 'buscar',
    loadChildren: () => import('./pages/buscar/buscar.module').then( m => m.BuscarPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'servicios',
    loadChildren: () => import('./pages/servicios/servicios.module').then( m => m.ServiciosPageModule)
  },
  {
    path: 'membresia',
    loadChildren: () => import('./pages/membresia/membresia.module').then( m => m.MembresiaPageModule)
  },
  {
    path: 'geo-ref',
    loadChildren: () => import('./pages/geo-ref/geo-ref.module').then( m => m.GeoRefPageModule)
  },  {
    path: 'geocoding',
    loadChildren: () => import('./pages/geocoding/geocoding.module').then( m => m.GeocodingPageModule)
  },
  {
    path: 'ubication-especifica',
    loadChildren: () => import('./pages/ubication-especifica/ubication-especifica.module').then( m => m.UbicationEspecificaPageModule)
  },



 



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
