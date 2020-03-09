import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { MerchantByCategory } from '../model/MerchantByCategory';
import { GetCategoryDto } from '../model/GetCategoryDto';

@Injectable({
  providedIn: 'root'
})
export class categorymanagementService {

  CategoryDto:GetCategoryDto={
    type:null,
    ipcountry:null
  }
  
  constructor(private http: HttpClient, public router: Router,private localstorage:LocalStorageService) { }

  public GetMerchantbyCategoryId(merchant:MerchantByCategory): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Merchant/GetMerchantByCategory/' , merchant);
  }

  public CategoryList(): Observable<any[]> {
    this.CategoryDto.ipcountry=this.localstorage.get("countryname");

    return this.http.post<any[]>(
      environment.API_URL + 'Category/GetCategories',this.CategoryDto
    );
  }

  public GetAllBanners(): Observable<any[]> {
    return this.http.get<any[]>(environment.API_URL + 'Banner/GetBanners/'+this.localstorage.get("countryname")+'/'+this.localstorage.get("Zone"));
  }

}
