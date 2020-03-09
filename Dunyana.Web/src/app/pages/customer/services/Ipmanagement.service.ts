import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IpmanagementService {

  constructor(private http: HttpClient, public router: Router) { }

  public Getipinfo(): Observable<any> {
   // return this.http.get<any>('http://api.ipapi.com/125.62.198.130?access_key=309c1092decb0be89d9f59f027333320');
   //return this.http.get<any>('https://ip-api.com/json');
   return this.http.get<any>('https://ipapi.co/json/');
  }

}
