import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Tracking } from '../model/tarcking';
import { OrderPaymentModel } from '../model/DTOs/PaymentModel';

@Injectable({
  providedIn: 'root'
})
export class OrdermanagementService {

  orderhistorydetailsdata: any[] = [];

  constructor(private http: HttpClient, public router: Router) { }

  public GetOrderHistory(customerid): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'Orders/GetOrders/' + customerid);
  }

  public GetTrackingdetails(trackingdata: Tracking): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Naqel/TraceByWaybill', trackingdata);

  }
  public OrderWalletPayment(orderPaymentModel: OrderPaymentModel): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Orders/orderWalletPayment', orderPaymentModel);

  }

  public insertOrder(Order: any): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Orders/InsertOrders', Order);
  }
 
}
