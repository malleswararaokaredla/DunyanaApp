import { Injectable } from '@angular/core';
import { PaymentModel } from '../../model/DTOs/PaymentModel';

@Injectable()
export class CheckoutResponse {

    public storage: any;

    public isNewCard: boolean;

    public paymentModel:  PaymentModel;

    public constructor() {
        this.isNewCard = true;
        this.paymentModel = null;
    }

}