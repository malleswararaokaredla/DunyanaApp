import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../_services';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        const currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser && currentUser.token;
        const isApiUrl = request.url.startsWith(environment.API_URL);
        const loggedInUserId: string = sessionStorage.getItem('loggedInUserId');       
        if (isLoggedIn && isApiUrl) { 
            request = request.clone({
                setHeaders: {
                    'X-Frame-Options': 'DENY',
                    'X-Content-Type-Options': 'nosniff',
                    'X-XSS-Protection': '1',
                    Authorization: `Bearer ${currentUser.token}`,
                    UserId: loggedInUserId === null ?  '0' :  loggedInUserId
                }
            });
        }
       return next.handle(request);
    }
}
