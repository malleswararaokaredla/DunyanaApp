import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PaymentModel } from '../model/DTOs/PaymentModel';
import { WalletDto } from '../model/DTOs/WalletDto';
@Injectable({
  providedIn: 'root'
})
export class WalletmanagementService {

  constructor(private http: HttpClient) { }

  public GetWalletHistory(customerid): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Wallet/GetWalletHistory/' + customerid);
  }
  public MakePayment(paymentInfo: PaymentModel): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Payment/postPayment', paymentInfo);
  }
  public CheckPayment(ckosessionid: string): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Payment/threeDSSuccess?cko-session-id=' + ckosessionid);
  }
  public AddPayment(walletDto: WalletDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Wallet/InsertWalletHistory', walletDto);
  }
  public PayOrder(walletDto: WalletDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Orders/payOrder', walletDto);
  }
  public GetPaymentCards(customerid): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Wallet/getPaymentCards/' + customerid);
  }
}