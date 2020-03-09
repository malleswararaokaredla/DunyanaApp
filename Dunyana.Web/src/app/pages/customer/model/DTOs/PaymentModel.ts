export class PaymentModel {
        CardToken: string;
        Amount: number;
        Currency: string;
        Reference: string;
        Capture: boolean;
        DoThreeDS: boolean;
        CustomerId: string;
        isExistingCard: boolean;
        cvv: number;
        saveCard: boolean;
        paymentCardId: number;
        isFromOrder: boolean;
        orderID: any;
        cardBin: any;
    }
export class OrderPaymentModel {
    orderID: any;
    customerId: string;
    orderAmount: any;
}
