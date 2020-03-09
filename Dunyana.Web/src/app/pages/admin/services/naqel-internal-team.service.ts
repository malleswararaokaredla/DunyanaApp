import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LegalTeam } from '../model/naqel-legal-team';
import { legalDto } from '../../naqel-internal/model/legal-teamdto';
import { Naqeluser } from '../model/naqeluser';
import { testcs } from '../model/testcs';
import { FileParameter } from '../model/FileParameter';
import { Merchant } from '../model/Merchant';

@Injectable({
  providedIn: 'root'
})
export class NaqelInternalTeamService {

  constructor(private http: HttpClient) { }

  public GetNaqelfinanceteamList(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Naqel/getAllOrders');
  }
  // public GetNaqelcontractteamList(): Observable<any> {
  //   return this.http.get<any>(environment.API_URL + 'Naqel/getMerchantContracts');
  // }
  public GetNaqelcontractteamList(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'MerchantContract/getMerchantContractlist');
  }
  public GetNaqellegalteamList(legaldto:legalDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Naqel/getMerchantRequests',legaldto);
  }
  public GetNaqellegalstatus(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Naqel/getMerchantApprovalstatus');
  }
  public UpdateNaqellegalstatus(legalteam): Observable<LegalTeam> {
    return this.http.post<LegalTeam>(environment.API_URL + 'Naqel/updateMerchantRequest',legalteam);
  }
  public UpdateNaqelprofile(user:Naqeluser): Observable<Naqeluser> {
    return this.http.post<Naqeluser>(environment.API_URL + 'Naqel/updateNaqelUser',user);
  }

  public Uploadfile(fordata): Observable<any> {
    return this.http.post<any>(environment.API_URL + '/MerchantContract/insertMerchantContract',fordata);
  }

  public GetMerchantBonusData(): Observable<any> {
    return this.http.get<any>(environment.API_URL + '/MerchantBonus/GetMerchantBonus');
  }

  public UpdateMerchantData(merchant: Merchant): Observable<Merchant> {
    return this.http.post<Merchant>(environment.API_URL + '/MerchantBonus/UpdateMerchantBonus', merchant);
  }

  public GetCustomers(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Naqel/getCustomerWalletBalance');
  }

  // public Uploadfile(uploadedFile: FileParameter, userId: any): Observable<string> {
  //   let url_ = "https://localhost:44343/api/upload/UploadFile?";
  //   url_ += "userId=" + encodeURIComponent("" + userId) + "&"; 
  //   url_ = url_.replace(/[?&]$/, "");

  //   const content_ = new FormData();
  //   if (uploadedFile === null || uploadedFile === undefined)
  //       throw new Error("The parameter 'uploadedFile' cannot be null.");
  //   else
  //       content_.append("uploadedFile", uploadedFile.data, uploadedFile.fileName ? uploadedFile.fileName : "uploadedFile");


  //   let file : any = {
  //     body: content_,
  //     observe: "response",
  //     responseType: "blob",
  //     headers: new HttpHeaders({
  //         "Accept": "application/json",
  //         'Content-Type': 'multipart/form-data'

  //     })
  // };
  
  //   return this.http.post<string>(url_,file);
  // }

}
