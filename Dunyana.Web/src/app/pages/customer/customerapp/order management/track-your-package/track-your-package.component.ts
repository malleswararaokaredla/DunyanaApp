import { Component, OnInit } from '@angular/core';
import { Tracking } from '../../../model/tarcking';
import { OrdermanagementService } from '../../../services/ordermanagemet.service';

@Component({
  selector: 'app-track-your-package',
  templateUrl: './track-your-package.component.html',
  styleUrls: ['./track-your-package.component.scss']
})
export class TrackYourPackageComponent implements OnInit {

  isdisabled: boolean = true;
  isradioselected: boolean = true;

  trackparameters: any = {};
  selectedtracknumber: string = "";
  waybillNo: string = null;
  OrderNo: string = null;
  isnoorders: boolean = true;
  noordermsg:boolean=true;
  norecordes: string = "";
  ProgressSpinnerDlg:boolean=false;
  errormsg:string="";
  trackdata: Tracking = {

    clientID: 0,
    password: null,
    version: null,
    waybillNo: 0
  }
  model: any = {};

  mustMatch: string[] = [];

  trackingdata: any[] = [];

  constructor(private orderservice: OrdermanagementService) { }

  ngOnInit() {
    this.gotoTop();
  }
  selectedtrackno(event) {

    if (this.selectedtracknumber == "W" || this.selectedtracknumber == "O") {
      this.isradioselected = false;
    }
  }
  validateform() {

    if (this.trackparameters.id != null) {
      if (this.trackparameters.id.length > 0) {
        this.isdisabled=false;
      }
      else {
        this.isdisabled = true;
      }
    }
    else {
      this.isdisabled = true;
    }
  }
  Trackpackage() {
  if(this.trackparameters.id!=null)
  {
    if(this.trackparameters.id.length>0)
    {
      this.ProgressSpinnerDlg=true;
      if(this.trackparameters.id.match('^([A-Za-z0-9-]+ )+[A-Za-z0-9-]+$|^[A-Za-z0-9-]+$'))
      {
        this.errormsg="";
        this.trackdata.clientID = 9018543;
        this.trackdata.password = "test1234";
        this.trackdata.version = "9.0";
        if (this.selectedtracknumber == "W") {
    
          this.trackdata.waybillNo = parseInt(this.trackparameters.id);
        }
        else if (this.selectedtracknumber == "O") {
    
          this.trackdata.waybillNo = parseInt(this.trackparameters.id);    
        }
        this.orderservice.GetTrackingdetails(this.trackdata).subscribe(res => {
          this.ProgressSpinnerDlg=false;
          this.trackingdata = res;
          this.trackingdata.sort((val1, val2) => { return val1.activityCode - val2.activityCode });
          this.isnoorders = false;
          this.noordermsg=true;
        
        },
          error => {
            if (this.selectedtracknumber == "W") {
          
              this.norecordes = "Waybill Number Not Found";
            }
            else if (this.selectedtracknumber == "O") {
        
              this.norecordes = "Order Number Not Found";
        
            }
            this.isnoorders = true;
            this.noordermsg=false;
            this.ProgressSpinnerDlg=false;
          });
      }
      else
      {
        this.ProgressSpinnerDlg=false;
        this.errormsg="Please enter valid order or waybill number";
      }
    }
    else
    {
      this.norecordes = "";
      this.isnoorders = true;
      this.noordermsg=false;
      this.errormsg="Please enter order or waybill number";
    }
      
    }
    else
    {
      this.norecordes = "";
      this.isnoorders = true;
      this.noordermsg=false;
    }
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
}
