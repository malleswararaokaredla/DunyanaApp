import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import{WalletDto}from  '../model/DTOs/WalletDto';

@Injectable({
  providedIn: 'root'
})
export class SearchingService {

  constructor(private http: HttpClient,public router:Router) { }

  public GetSearchData(searchdata): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Search/search/'+searchdata);
  }

  public Insertwalletmoney(walletDto:WalletDto):Observable<WalletDto>{
    return this.http.post<WalletDto>(environment.API_URL+'Wallet/InsertWalletHistory',walletDto);
  }

}
