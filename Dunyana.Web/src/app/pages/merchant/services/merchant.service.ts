import { Injectable } from '@angular/core';
import { MerchantDto } from '../modal/MerchantDto';
import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import {RegistrationDto } from '../../customer/model/DTOs/RegistraionDto';
import { MerchantUrlDto } from '../modal/MerchantUrlDto';
import { Merchantbilldoc } from '../modal/Merchantbilldoc';
import { GetCategoryDto } from '../../customer/model/GetCategoryDto';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {

  CategoryDto:GetCategoryDto={
    type:null,
    ipcountry:null
  }
  
  constructor(private http: HttpClient,public router:Router,private localstorage:LocalStorageService) { }

  public merchentRegistration(merchantregistor: MerchantDto): Observable<MerchantDto> {
    return this.http.post<MerchantDto>(environment.API_URL + 'Merchant/InsertMerchant', merchantregistor);
  }
  
  public merchenturlparams(merchantservicedata:any,merchentid):Observable<any>{
    return this.http.post(environment.API_URL + 'MerchantRedirection/insertMerchantRedirection/'+merchentid, merchantservicedata);
  }

  public updatemerchenturlparams(merchantservicedata:any,merchentid):Observable<any>{
    return this.http.post(environment.API_URL + 'MerchantRedirection/updateMerchantRedirectionValue/'+merchentid, merchantservicedata);
  }

  public merhenturlupdation(merchenturl:MerchantUrlDto):Observable<MerchantUrlDto>{
    return this.http.post<MerchantUrlDto>(environment.API_URL+'MerchantRedirection/updateMerchantRedirectionUrl',merchenturl);
  }

  public EmailVerification(registrationDto: RegistrationDto): Observable<RegistrationDto> { 
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/EmailCheckValidation', registrationDto);
  }

  public GetCountries(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'LookupTypeValue/GetCountrylist');
  }

  public Getcategories(): Observable<any> {
    this.CategoryDto.ipcountry=this.localstorage.get("countryname");
    return this.http.post<any>(environment.API_URL + 'Category/GetCategories', this.CategoryDto);
  }

  public Getmerchantdata():Observable<any>{
    return this.http.get<any>(environment.API_URL+'MerchantRedirection/getMerchantsRedirection');
  }

 
  public Getmerchantdetials(merchantid):Observable<any>{
    return this.http.get<any>(environment.API_URL+'MerchantRedirection/getMerchantRedirectionlist/'+merchantid);
  }

  public Getmerchantbilldocs(merchant:Merchantbilldoc):Observable<any>{
    return this.http.post<any>(environment.API_URL+'MerchantContract/getContractByMerchant',merchant);
  }

  public Updatemerchantprofile(merchant:MerchantDto):Observable<MerchantDto>{
    return this.http.post<MerchantDto>(environment.API_URL + 'Merchant/updateMerchant', merchant);
  }

}
