import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class DealsmanagementService {

  constructor(private http: HttpClient, public router: Router,private localstorage:LocalStorageService) { }

  public GetDealsList(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Deals/getDeals/'+this.localstorage.get("countryname")+'/'+this.localstorage.get("Zone"));
  }
}
