import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
 
import { BaseComponent } from '../BaseComponent';
 
import { LocalStorageService } from 'angular-web-storage';

@Injectable()
export class AuthGuard extends BaseComponent
  implements CanActivate {
  public isLoggedIn = false;

  constructor(
    private router: Router, 
    private localStorage: LocalStorageService
  ) {
    super();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.isLoggedIn) {
      return true;
    } else { 
          if (this.localStorage.get('Email') === null) {
                  this.loadLoginPage();
          } else {
            return true;
          }
 
    }
  }

  loadLoginPage() {
    this.isLoggedIn = false;
    this.localStorage.remove("username");
    this.localStorage.remove("Email");
    this.localStorage.remove("customerid");
    this.localStorage.remove("otp");
    this.localStorage.remove("PWD");
    this.localStorage.remove("loginType");
    this.localStorage.remove("timerData");
    this.router.navigateByUrl('signin');
    return false;
  }
}
