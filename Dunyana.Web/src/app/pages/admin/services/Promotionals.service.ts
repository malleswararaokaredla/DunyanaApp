import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { user } from '../model/user';
import { AdminPromotionalDto } from '../model/AdminPromotionalDto';
import { Insertpromotions } from '../model/Addpromotions';
import { Updatepromotions } from '../model/UpdateadminpromotionalDto';
import { DeleteAdminPromotionalDto } from '../model/DeleteAdminPromotionalDto';
import { LocalStorageService } from 'angular-web-storage';
@Injectable({
  providedIn: 'root'
})
export class Promotionals {

  constructor(private http: HttpClient,public router:Router,private localstorage:LocalStorageService) { 

  }

  public Getadminhomepromotionslist(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Admin/getAdminHomePromotionals/'+this.localstorage.get("countryname")+'/'+this.localstorage.get("Zone"));
  }
  public Getadminpromotionslist(type:AdminPromotionalDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Admin/getAdminPromotionals',type);
  }
  public Addpromotions(promotion:Insertpromotions): Observable<Insertpromotions> { 
    return this.http.post<Insertpromotions>(environment.API_URL + 'Admin/insertAdminPromotionals', promotion);
  }
  public Updatepromotions(promotion:Updatepromotions): Observable<Updatepromotions> { 
    return this.http.post<Updatepromotions>(environment.API_URL + 'Admin/updateAdminPromotionals', promotion);
  }

  public Deletepromotion(promotion:DeleteAdminPromotionalDto): Observable<DeleteAdminPromotionalDto> { 
    return this.http.post<DeleteAdminPromotionalDto>(environment.API_URL + 'Admin/deleteAdminPromotionals', promotion);
  }
}
