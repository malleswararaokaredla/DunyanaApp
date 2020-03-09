import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LegalTeam } from '../model/naqel-legal-team';
import { legalDto } from '../model/legal-teamdto';

@Injectable({
  providedIn: 'root'
})
export class NaqelInternalTeamService {

  constructor(private http: HttpClient) { }

  public GetNaqelfinanceteamList(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Naqel/getAllOrders');
  }
  public GetNaqelcontractteamList(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Naqel/getMerchantContracts');
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
}
