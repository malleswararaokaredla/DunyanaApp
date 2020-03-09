import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { user } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

   
  constructor(private http: HttpClient,public router:Router) { }

  public UserList(): Observable<any[]> {
    return this.http.get<any[]>(
      environment.API_URL + 'Admin/GetUsers',
    );
  }

  public AddUser(userObj: user): Observable<user> {
    return this.http.post<user>(environment.API_URL + 'Admin/AddUser', userObj);
  }

  public UpdateUser(userObj: user): Observable<user> {
    return this.http.post<user>(environment.API_URL + 'Admin/updateUser', userObj);
  }
  public GetCountriesList(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'LookupTypeValue/GetCountrylist');
  }
 
  public getNaqelUserTypes(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'LookupTypeValue/getNaqelUserTypes');
  }
  
}
