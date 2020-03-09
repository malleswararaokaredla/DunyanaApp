import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(catchError(err => {
      if (err.status === 400 || err.status === 404 ) {
          return throwError(err);
      }
      if ((err.status === 403 || err.status === 401) && (!request.url.includes('api/v1/authn'))
        && (!request.url.includes('/signin'))
      ) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigateByUrl('/session-timeout');
       // alert('Your session expired, redirecting to sign in ...Please sign in');
        this.router.navigateByUrl('/signin');
        return throwError('Unauthorization');
      }
      // const error = err.error.message || err.statusText;
    }));
  }}
