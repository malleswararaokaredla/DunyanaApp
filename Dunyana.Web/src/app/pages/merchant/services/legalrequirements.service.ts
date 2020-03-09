import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MerchantAccountDto } from '../modal/MerchantAccountDto';
import { MerchantAccountDetailsDto } from '../modal/MerchantAccountDetailsDto';

@Injectable({
  providedIn: 'root'
})
export class LegalrequirementsService {

  constructor(private http: HttpClient) { }

  public GetLegalrequirements(merchantdata:MerchantAccountDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Merchant/getMerchantAccountDetails' , merchantdata);
  }

  public UpdateLegalAccountData(details:MerchantAccountDetailsDto): Observable<MerchantAccountDetailsDto> { 
    return this.http.post<MerchantAccountDetailsDto>(environment.API_URL + 'Merchant/updateMerchantAccountDetails', details);
  }
}
