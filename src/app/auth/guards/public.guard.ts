import { Injectable } from '@angular/core';
import { CanMatch, CanActivate, Router, Route, UrlSegment, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate {
  constructor(private authService: AuthService,
    private router: Router,) { }


  private checkAuthStat(): Observable<boolean> {
    return this.authService.checkAuthStatus()
    .pipe(
      tap(isAuthenticated => {
        if( isAuthenticated ) this.router.navigate(['./'])
      }),
    map(isAuth => !isAuth)
    )
  }

  canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.checkAuthStat()
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
      return this.checkAuthStat()
    }

}
