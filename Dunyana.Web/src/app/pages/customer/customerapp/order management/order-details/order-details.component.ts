import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdermanagementService } from '../../../services/ordermanagemet.service';
import { LocalStorageService } from 'angular-web-storage';
import { Productdetails } from '../../../model/ProductDetails';
import { Tracking } from '../../../model/tarcking';
import { PagerService } from '../../../services/pager.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  currencytype: string = '';

  totalorderproductsRecords: any = 0;
  pager: any = {};
  pagedItems: any[] = [];

  display: boolean = false;
  paymentstatus: string;

  Iscod: boolean = true;
  customerid: number;
  productid: number = 0;
  orderId: number;
  orderhistorylist: any[] = [];
  productitem: any = {};
  selectedproduct: any = {};
  no_orderimg: string = "";

  ProgressSpinnerDlg: boolean = false;
  orderdelivered: boolean = false;
  productdetails: Productdetails = {
    productimage: null,
    ordereddate: null,
    productcost: null,
    cardnumber: null,
    address: null,
    status: null,
    zip: null,
    country: null,
    productname: null,
    orderID: null,
    paymentStatus: null,
    cod: null
  }
  trackdata: Tracking = {

    clientID: 0,
    password: null,
    version: null,
    waybillNo: 0
  }
  trackingdata: any[] = [];

  constructor(private router: ActivatedRoute, private orderservice: OrdermanagementService,
    private localStorage: LocalStorageService, private pagerService: PagerService,
    private route: Router) { }

  ngOnInit() {
    this.no_orderimg = "assets/layout/images/no-image.png";
    //this.currencytype = this.localStorage.get("customercurrency");
    this.customerid = this.localStorage.get("customerid");
    this.productid = parseInt(this.router.snapshot.params['ordid']);
    this.GetOrderHistoryDetails();
    this.gotoTop();
    this.localStorage.remove('returnUrl');

  }
  GetOrderHistoryDetails() {
    this.ProgressSpinnerDlg = true;
    if (this.orderservice.orderhistorydetailsdata.length != 0) {
      this.orderhistorylist = this.orderservice.orderhistorydetailsdata;
    }

    // this.orderservice.GetOrderHistory(this.customerid).subscribe(res => {
    //   this.orderhistorylist = res;
    this.Fillproductdetails();
    // });
  }

  Fillproductdetails() {
    this.orderhistorylist.forEach(items => {
      if (items.orderID == this.productid) {
        this.productitem = items;
        this.totalorderproductsRecords = this.productitem["products"].length;
        sessionStorage.setItem('orderPaymentAmount', this.productitem["orderAmount"].toString());
        sessionStorage.setItem('orderId', this.productitem["products"][0]["orderID"].toString());
        if (this.productitem["products"].length > 0) {
          this.viewtrackdetails(this.productitem["products"][0]["productID"]);
        }
        this.setPage(1);

        if (this.productitem["cod"] != null && this.productitem["cod"] === "Y" && this.productitem["paymentStatus"] != "1") {
          this.Iscod = false;
        }
        else {
          this.Iscod = true;
        }
        // this.productitem.forEach(item=>{

        //   if (item["cod"] != null && item["cod"].toUpperCase() === "Y" && item["paymentStatus"] != 1) {
        //     this.Iscod = false;
        //   }
        //   else {
        //     this.Iscod = true;
        //   }
        // });
        this.ProgressSpinnerDlg = false;

      }
      // var prod: any[] = items["products"];
      // let proitems = [];
      // proitems = prod.filter(x => x.productID == this.productid);

      // items["products"].forEach(x => {
      //   if (Number.parseInt(x["productID"]) == this.productid) {
      //     this.productdetails.productcost = items["orderAmount"];
      //   }
      // })

      // if (proitems.length > 0) {

      //   this.productitem = proitems;
      //   this.productitem.forEach(x => {

      //     if (items["cod"] != null && items["cod"].toUpperCase() === "Y" && x["paymentStatus"] != 1) {
      //       this.Iscod = false;
      //     }
      //     else {
      //       this.Iscod = true;
      //     }
      //   });
      // }
    });

    // this.productitem.forEach(item => {

    //   if (item["productImage"] === "") {
    //     this.productdetails.productimage = "assets/layout/images/no-image.png";
    //   }
    //   else {
    //     this.productdetails.productimage = item["productImage"];
    //   }
    //   this.productdetails.productname = item["productName"];
    //   this.productdetails.paymentStatus = item['paymentStatus'];
    //   if (item['cod'] === 'N') {
    //     this.productdetails.paymentStatus = "Paid";
    //   } else {
    //     if (Number.parseInt(this.productdetails.paymentStatus) === 1) {
    //       this.productdetails.paymentStatus = "Paid";
    //     }
    //     else {
    //       this.productdetails.paymentStatus = "Not paid";
    //     }
    //   }
    //   this.orderId = item['orderID'];
    //   this.Gettrackdetails();
    // });
    //sessionStorage.setItem('orderPaymentAmount', this.productdetails.productcost.toString());
    //sessionStorage.setItem('orderId', this.productitem["orderID"].toString());
  }
  onDialogClose(event) {
    this.display = event;
  }
  editaddressinmap() {
    this.display = true;
  }
  backtoaccountpage() {
    this.route.navigateByUrl("customer/customeraccount");
  }

  setPage(page: number) {
    this.pagedItems = [];
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalorderproductsRecords, page, 3);
    this.pagedItems = this.productitem["products"].slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  Gettrackdetails() {
    this.trackdata.clientID = 9018543;
    this.trackdata.password = "test1234";
    this.trackdata.version = "9.0";
    this.trackdata.waybillNo = 80025235;
    this.orderservice.GetTrackingdetails(this.trackdata).subscribe(res => {
      this.trackingdata = res;
      this.trackingdata.sort((val1, val2) => { return val1.activityCode - val2.activityCode });
      this.trackingdata.forEach(x => {
        if (x["activity"] === "Delivered") {
          this.orderdelivered = true;
        }
        else {
          this.orderdelivered = false;
        }
      });
      this.ProgressSpinnerDlg = false;
    });
  }
  gotoTop() {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 5);
  }

  payOrder() {
    this.localStorage.set('returnUrl', this.route.url);
    this.route.navigateByUrl('/customer/pay-order');
  }
  viewtrackdetails(productID) {

    this.productitem["products"].forEach(res => {
      if (res["productID"] == productID) {
        this.selectedproduct = res;
      }
    });

  }
}
