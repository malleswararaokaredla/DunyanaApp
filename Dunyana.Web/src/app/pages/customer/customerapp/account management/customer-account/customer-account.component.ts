import { Component, OnInit} from '@angular/core';
import { UsermanagementService } from '../../../services/usermanagement.service';
import { RegistrationDto } from '../../../model/DTOs/RegistraionDto';
import { LocalStorageService } from 'angular-web-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { OrdermanagementService } from '../../../services/ordermanagemet.service';
import { PagerService } from '../../../services/pager.service';
import { orderhistory } from '../../../model/OrderHistory';
import { AuthGuard } from 'src/app/shared/auth//_guards';
@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.scss']
})
export class CustomerAccountComponent implements OnInit {
 
  currencytype: string = '';
  display: boolean = false;
  editdialogdisplay: boolean = false;
  test: string = "test";
  parentMessage = "Start Shopping";
  ProgressSpinnerDlg: boolean = false;
  orderhistorylist: any[] = [];
  customerid: number;

  totalorderproductsRecords: any = 0;
  pager: any = {};
  pagedItems: any[] = [];
  filtereditems: any[] = [];
  totalproducts: Array<orderhistory> = [];
  noorders: boolean = true;
  Walletamount:number=0;
  Walletpoints: number = 0;
  registerdto: RegistrationDto = {
    Id: 0,
    FirstName: null,
    LastName: null,
    Email: null,
    Mobile: null,
    Address: null,
    Country: null,
    City: null,
    Image: null,
    LoginType: null,
    FBID: null,
    GoogleID: null,
    oldPWD:null,
    PWD: null,
    Type: null,
    EmailVerified: 0,
    Status: 0,
    OTP: 0
  }

  profiledata = this.registerdto;
  constructor(private userservice: UsermanagementService, private localStorage: LocalStorageService, private router: Router,
    private orderservice: OrdermanagementService, private pagerService: PagerService,
    private authgurd:AuthGuard,private activate:ActivatedRoute,) { }

  ngOnInit() {

    if(this.localStorage.get("Email"))
    { 
      this.GetProfiledata();
    }
    else
    {
      this.router.navigateByUrl("customer/home");
    }

  }
  
  showDialog() {
    if(this.authgurd.canActivate(this.activate.snapshot,this.router.routerState.snapshot))
    {
    this.display = true;
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('noscroll');
    }
  }
  onDialogClose(event) {
    this.display = event;
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('noscroll');
  }


  showEditDialog() {
    if(this.authgurd.canActivate(this.activate.snapshot,this.router.routerState.snapshot))
    {
      this.editdialogdisplay = true;    
      let body = document.getElementsByTagName('body')[0];
      body.classList.add('noscroll');
    }
  }

  onEditDialogClose(event) {
    this.editdialogdisplay = event;
    this.GetProfiledata();
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('noscroll');
  }
  GetProfiledata() {
    this.ProgressSpinnerDlg = true;
    this.registerdto.Email = this.localStorage.get("Email");
    this.registerdto.Type=this.localStorage.get("loginType");
    this.userservice.GetProfileInformation(this.registerdto).subscribe(res => {
      this.profiledata.Image = res["image"];
      this.profiledata.FirstName = res["firstName"];
      this.profiledata.LastName = res["lastName"];
      this.profiledata.City = res["city"];
      this.profiledata.Address = res["address"];
      this.profiledata.Country = res["country"];
      this.profiledata.Email = res["email"];
      this.profiledata.Id = res["id"];
      this.profiledata.Mobile = res["mobile"];
      this.localStorage.set("customerid", res["id"]);
      this.profiledata.PWD = res["pwd"];
      this.localStorage.set("walletamount",res["wallet"]);
      this.localStorage.set('customercurrency', res["customercurrency"]);
      this.currencytype = this.localStorage.get("customercurrency");

      this.Walletamount=res["wallet"];
      this.localStorage.set("walletpoints", res["walletPoints"]);
      this.Walletpoints = res["walletPoints"];
      sessionStorage.setItem('Walletamount',  this.Walletamount.toString());
      this.GetOrderHistoryDetails();
    
    });
  }

  GetOrderDetails(productid) {
    this.router.navigateByUrl('customer/orderdetails/' + productid);
  }

  GetOrderHistoryDetails() {
    this.pagedItems=[];
    this.totalorderproductsRecords=0;
    this.pager={};
   
      this.orderhistorylist = [];
      this.customerid = this.localStorage.get("customerid");
      this.orderservice.GetOrderHistory(this.customerid).subscribe(res => {

        this.orderhistorylist = res;
        if (this.orderhistorylist.length > 0) {
          this.orderservice.orderhistorydetailsdata = res;
          this.Fillproductdetails();
        }
        else {
          this.noorders = false;
          this.ProgressSpinnerDlg = false;
        }
      });
    
  }

  Fillproductdetails() {
    this.totalproducts = [];
    this.totalorderproductsRecords=this.orderhistorylist.length;
    this.totalproducts=this.orderhistorylist;
    this.ProgressSpinnerDlg = false;
    this.setPage(1);
    // this.orderhistorylist.forEach(items => {
    //   this.totalorderproductsRecords = this.totalorderproductsRecords + items["products"].length;
    //   if(items["products"].length>0)
    //   {
    //     items["products"].forEach(prod => {
    //       let Orderproducthistory = new orderhistory();
  
    //       Orderproducthistory.orderid = items["orderID"];
    //       Orderproducthistory.orderplaced = items["orderDate"];
    //       Orderproducthistory.productname = prod["productName"];
    //       Orderproducthistory.productid = prod["productID"];
    //       Orderproducthistory.soldby=items["merchantName"];
    //       Orderproducthistory.orderstatus=items["orderStatus"];
    //       Orderproducthistory.Cod=items["cod"];
    //       Orderproducthistory.productcost=items["orderAmount"];
    //       Orderproducthistory.MasterCard="MasterCard ****5100";
    //       if (prod["productImage"] != "") {
    //         Orderproducthistory.productimage =  prod["productImage"];
    //       }
    //       else {
    //         Orderproducthistory.productimage = "assets/layout/images/no-image.png";
    //       }
    //       this.totalproducts.push(Orderproducthistory);
    //     });
    //     this.setPage(1);
    //   }
    
    // });
  }

  setPage(page: number) {
    this.pagedItems=[];
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.totalorderproductsRecords, page, 3);
    this.pagedItems = this.totalproducts.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  gotoTop(){
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); 
      } else {
          window.clearInterval(scrollToTop);
      }
  }, 5);
  }

  getPointsHistory() {
    if(this.Walletpoints > 0) {
      this.router.navigateByUrl('customer/app-walletpoints');
    }
  }

}
