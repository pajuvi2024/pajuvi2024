import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // Verificar la existencia del token de autenticación
    const token = localStorage.getItem('userToken');

    if (token) {
      // El token existe, permitir el acceso a la página
      return true;
    } else {
      // El token no existe, redirigir al componente de inicio de sesión
      return this.router.createUrlTree(['/login']); // Cambia '/login' por la ruta de tu página de inicio de sesión
    }
  }
}
