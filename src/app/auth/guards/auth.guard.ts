import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterStateSnapshot, UrlSegment, UrlTree, CanMatch, CanActivate, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {

  constructor(private authService: AuthService,
    private router: Router,
    ) { }

  private checkAuthStat(): Observable<boolean> {
    return this.authService.checkAuthStatus()
    .pipe(
      tap(isAuthenticated => {
        if( !isAuthenticated ) this.router.navigate(['./auth/login'])
      })
    )
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
  return this.checkAuthStat()
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.checkAuthStat()
  }

}
