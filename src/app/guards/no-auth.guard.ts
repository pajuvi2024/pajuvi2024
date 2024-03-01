import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    // Verificar la existencia del token de autenticación
    const token = localStorage.getItem('userToken');

    if (token) {
      // El token existe, redirigir a la página principal (o la página a la que debes redirigir)
      return this.router.createUrlTree(['/home']); // Cambia '/home' por la ruta a la que deseas redirigir a usuarios autenticados
    } else {
      // El token no existe, permitir el acceso a la página de inicio de sesión
      return true;
    }
  }
}
