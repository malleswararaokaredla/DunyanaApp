import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { OrdermanagementService } from '../../customer/services/ordermanagemet.service';
import { promise } from 'protractor';
import { XLSX$Consts, read } from 'xlsx';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orderCols: any[];
  orders: any[] = [];
  addDialogDisplay = false;
  ordersForm: FormGroup;
  btndisable = 'disable';
  pymtAddBtn = 'disable';
  error = null;

  constructor(
    private fb: FormBuilder,
    private orderService: OrdermanagementService,
  ) { }

  ngOnInit() {
    this.orderCols = [
      { field: 'orderID', header: 'Order ID' },
      { field: 'OrderNo', header: 'Order Number' },
      { field: 'merchantId', header: 'Merchant ID' },
      { field: 'merchantName', header: 'Merchant Name' },
      { field: 'productName', header: 'Product Name' },
    ];

    this.ordersForm = this.fb.group({
      merchantID: ['', Validators.required],
      merchantUserName: ['', Validators.required],
      merchantPassword: ['P@ssw0rd'],
      customerID: ['', Validators.required],
      orderDetails:
        this.fb.group({
            orderNo: ['', Validators.required],
            orderDate: ['', Validators.required],
            orderAmount: ['', Validators.required],
            cod: ['', Validators.required],
            orderStatus: ['', Validators.required],
            consigneeAddressLine1: ['', Validators.required],
            consigneeAddressLine2: ['', Validators.required],
            consigneeAddressCity: ['', Validators.required],
            consigneeAddressState: ['', Validators.required],
            consigneeAddressCountry: ['', Validators.required],
            consigneeAddresszip: ['', Validators.required],
            consigneeAddressMobileNo: ['', Validators.required],
            consigneeAddressPhone: ['', Validators.required],
            latitude: ['', Validators.required],
            longitude: ['', Validators.required],
        }),
        waybillProduct: this.fb.array([]),
        payments: this.fb.array([])
    });

  }

  get waybillProduct() {
    return this.ordersForm.get('waybillProduct') as FormArray;
  }

  get payments() {
    return this.ordersForm.get('payments') as FormArray;
  }

  addItems() {
    this.waybillProduct.push(
      this.fb.group({
        waybillNo: this.fb.control('', Validators.required),
        ProductID: this.fb.control('', Validators.required),
        productSKU: this.fb.control('', Validators.required),
        productImage: this.fb.control('', Validators.required),
        productName: this.fb.control('', Validators.required),
        description: this.fb.control('', Validators.required),
        quantity: this.fb.control('', Validators.required),
        unitCost: this.fb.control('', Validators.required),
        currencyCode: this.fb.control('', Validators.required),
        returndate: this.fb.control('', Validators.required),
      })
    );
  }

  addPayment() {
    this.payments.push(
      this.fb.group({
        paymentDate: this.fb.control('', Validators.required),
        amount: this.fb.control('', Validators.required),
        currency: this.fb.control('', Validators.required),
        card: this.fb.control('', Validators.required),
        cardscheme: this.fb.control('', Validators.required),
        cardType: this.fb.control('', Validators.required),
        paymentStatus: this.fb.control('', Validators.required),
        transactionId: this.fb.control('', Validators.required),
        transactionType: this.fb.control('', Validators.required),
        returnPaymentResponse: this.fb.control('', Validators.required),
      })
    );
  }

  displayAddDialog() {
    this.addDialogDisplay = true;
  }

  onClose() {
    this.addDialogDisplay = false;
    this.ordersForm.reset();
    for (let i = 0; i < this.waybillProduct.length; i++) {
      this.waybillProduct.removeAt(i);
    }
    for (let i = 0; i < this.payments.length; i++) {
      this.payments.removeAt(i);
    }
  }

  saveOrder() {
    let formData = this.ordersForm.value;
    let json = {};
    json['merchantID']       = formData.merchantID;
    json['merchantUserName'] = formData.merchantUserName;
    json['merchantPassword'] = formData.merchantPassword;
    json['customerID']       = formData.customerID;

    let orderDetailsJson = {};
    orderDetailsJson['orderNo'] = formData.orderDetails.orderNo;
    orderDetailsJson['orderDate'] = formData.orderDetails.orderDate;
    orderDetailsJson['orderAmount'] = formData.orderDetails.orderAmount;
    orderDetailsJson['cod'] = (formData.orderDetails.cod).toUpperCase();
    orderDetailsJson['orderStatus'] = formData.orderDetails.orderStatus;
    orderDetailsJson['consigneeAddressLine1'] = formData.orderDetails.consigneeAddressLine1;
    orderDetailsJson['consigneeAddressLine2'] = formData.orderDetails.consigneeAddressLine2;
    orderDetailsJson['consigneeAddressCity'] = formData.orderDetails.consigneeAddressCity;
    orderDetailsJson['consigneeAddressState'] = formData.orderDetails.consigneeAddressState;
    orderDetailsJson['consigneeAddressCountry'] = formData.orderDetails.consigneeAddressCountry;
    orderDetailsJson['consigneeAddresszip'] = formData.orderDetails.consigneeAddresszip;
    orderDetailsJson['consigneeAddressMobileNo'] = formData.orderDetails.consigneeAddressMobileNo;
    orderDetailsJson['consigneeAddressPhone'] = formData.orderDetails.consigneeAddressPhone;
    orderDetailsJson['latitude'] = formData.orderDetails.latitude;
    orderDetailsJson['longitude'] = formData.orderDetails.longitude;

    let bills = [];
    bills['products'] = [];

    if (formData.waybillProduct.length === 1) {
      let waybill = {};
      waybill['waybillNo'] = formData.waybillProduct[0].waybillNo;
      waybill['products'] = [];
      let product = {};
      product['ProductID']    = formData.waybillProduct[0].ProductID;
      product['productSKU']   = formData.waybillProduct[0].productSKU;
      product['productImage'] = formData.waybillProduct[0].productImage;
      product['productName']  = formData.waybillProduct[0].productName;
      product['description']  = formData.waybillProduct[0].description;
      product['quantity']     = formData.waybillProduct[0].quantity;
      product['unitCost']     = formData.waybillProduct[0].unitCost;
      product['currenyCode']  = formData.waybillProduct[0].currencyCode;
      product['returndate']   = formData.waybillProduct[0].returndate;
      waybill['products'].push(product);
      bills.push(waybill);
    } else if (formData.waybillProduct.length > 1) {
      (formData.waybillProduct).forEach(function(element) {
        if (bills.length === 0) {
          let waybill = {};
          waybill['waybillNo']      = element.waybillNo;
          let products = [];
          let product = {};
          product['ProductID']    = element.ProductID;
          product['productSKU']   = element.productSKU;
          product['productImage'] = element.productImage;
          product['productName']  = element.productName;
          product['description']  = element.description;
          product['quantity']     = element.quantity;
          product['unitCost']     = element.unitCost;
          product['currenyCode']  = element.currenyCode;
          product['returndate']   = element.returndate;
          products.push(product);
          waybill['products'] = products;
          bills.push(waybill);
        } else if(bills.length >= 1) {
          let valid = false;
          bills.forEach(function(waybills) {
            if (element.waybillNo === waybills.waybillNo) {
              let product = {};
              product['ProductID']    = element.ProductID;
              product['productSKU']   = element.productSKU;
              product['productImage'] = element.productImage;
              product['productName']  = element.productName;
              product['description']  = element.description;
              product['quantity']     = element.quantity;
              product['unitCost']     = element.unitCost;
              product['currenyCode']  = element.currenyCode;
              product['returndate']   = element.returndate;
              waybills['products'].push(product);
              valid = true;
            }
          });
          if (valid === false) {
            let waybill = {};
            waybill['waybillNo']      = element.waybillNo;
            let products = [];
            let product = {};
            product['ProductID']    = element.ProductID;
            product['productSKU']   = element.productSKU;
            product['productImage'] = element.productImage;
            product['productName']  = element.productName;
            product['description']  = element.description;
            product['quantity']     = element.quantity;
            product['unitCost']     = element.unitCost;
            product['currenyCode']  = element.currenyCode;
            product['returndate']   = element.returndate;
            products.push(product);
            waybill['products'] = products;
            bills.push(waybill);
          }
        }
      });
    }
    orderDetailsJson['waybill'] = bills;
    let payments = [];

    (formData.payments).forEach(function(element) {
      let payment = {};
      payment['paymentDate']            = element.paymentDate;
      payment['amount']                 = element.amount;
      payment['currency']               = element.currency;
      payment['card']                   = element.card;
      payment['cardscheme']             = element.cardscheme;
      payment['cardType']               = element.cardType;
      payment['paymentStatus']          = element.paymentStatus;
      payment['transactionId']          = element.transactionId;
      payment['transactionType']        = element.transactionType;
      payment['returnPaymentResponse']  = element.returnPaymentResponse;

      payments.push(payment);
    });
    orderDetailsJson['paymentDetails'] = payments;
    json['orderDetails'] = [];
    json['orderDetails'].push(orderDetailsJson);

    this.orderService.insertOrder(json).subscribe(res => {
      if (res.result === 'Orders created successfully') {
        this.addDialogDisplay = false;
      }
    });
  }

  formvalidate() {
    if ( this.ordersForm.valid &&  this.ordersForm.value.waybillProduct.length > 0 ) {
      if (this.ordersForm.value.orderDetails.cod === 'N') {
        if (this.ordersForm.value.payments.length > 0) {
          this.btndisable = 'line_btn sblue mr-4';
        } else {
          this.btndisable = 'disable';
        }
      } else if (this.ordersForm.value.orderDetails.cod === 'Y') {
        this.btndisable = 'line_btn sblue mr-4';
      }
    } else {
      this.btndisable = 'disable';
    }
  }

  getValidity(i, control) {
    let status = 'VALID';
    let controlData = (<FormArray>this.ordersForm.get('waybillProduct')).controls[i]['controls'][control];
    if (controlData.touched === true) {
      status = controlData.status;
    }
    return status;
  }

  getPaymentsValidity(i, control) {
    let status = 'VALID';
    let controlData = (<FormArray>this.ordersForm.get('payments')).controls[i]['controls'][control];
    if (controlData.touched === true) {
      status = controlData.status;
    }
    return status;
  }

  enableAddPayment() {
    if ( (this.ordersForm.value['orderDetails']['cod']).toUpperCase() === 'N' ) {
      this.pymtAddBtn = 'line_btn sblue mr-4';
    } else {
      for (let i = 0; i < this.payments.length; i++) {
        this.payments.removeAt(i);
      }
      this.pymtAddBtn = 'disable';
    }
  }

  fileUpload(file) {
    console.log('EVENT ===>>> ', file);
    let reader = new FileReader();
    let workbook;
    let rowObject;
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
      reader.onload = function() {
        let data = reader.result;
        workbook = read(data, {type: 'binary'});
        const alphaArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                          'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        const sheets = ['Order Details', 'Payment Details', 'Waybill & Product Details'];
        let json = {};
        let orderDetails = [];
        console.log('WORK BOOK DETAILS ===>>> ', workbook);
        console.log('ORDER DETAILS EXCEL ===>>> ', workbook.Sheets['Order Details']);
        sheets.forEach(function(sheet) {
          const startCol = workbook.Sheets[sheet]['!ref'].split(':')[0].substr(0, 1);
          const endCol = workbook.Sheets[sheet]['!ref'].split(':')[1].substr(0, 1);
          const lastIndex = workbook.Sheets[sheet]['!ref'].split(':')[1].substr(1, workbook.Sheets[sheet]['!ref'].split(':')[1].length);
          for (let i = 2; i < lastIndex; i++) {
            for (let j = 0; j <= alphaArr.length; j++) {
              if (alphaArr[j] === endCol) {} else {}
            }
          }
        });
        json['orderDetails'] = orderDetails;
        console.log('SEDING JSON ===>>> ', json);
      };
    });

  }

}
