import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MerchantBannerDto } from '../modal/MerchantBannerDto';
import { DealsDto } from '../modal/DealsDto';
import { UpdateDealsDto } from '../modal/UpdatedealDto';
import { DeletedealDto } from '../modal/DeletedealDto';

@Injectable({
  providedIn: 'root'
})
export class DealsService {
  constructor(private http: HttpClient, public router: Router) { }

  public GetdealsList(MerchantBanner:MerchantBannerDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Deals/getDealsByMerchant' , MerchantBanner);
  }

  public Adddeals(deal:DealsDto): Observable<DealsDto> { 
    return this.http.post<DealsDto>(environment.API_URL + 'Deals/insertDeals', deal);
  }
  public Updatedeals(deal:UpdateDealsDto): Observable<UpdateDealsDto> { 
    return this.http.post<UpdateDealsDto>(environment.API_URL + 'Deals/updateDeals', deal);
  }
  public Deletedeal(deal:DeletedealDto): Observable<DeletedealDto> { 
    return this.http.post<DeletedealDto>(environment.API_URL + 'Deals/deleteDeals', deal);
  }
}