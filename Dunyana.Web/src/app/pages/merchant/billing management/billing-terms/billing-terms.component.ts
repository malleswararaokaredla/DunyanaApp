import { Component, OnInit } from '@angular/core';
import { Merchantbilldoc } from '../../modal/Merchantbilldoc';
import { MerchantService } from '../../services/merchant.service';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-billing-terms',
  templateUrl: './billing-terms.component.html',
  styleUrls: ['./billing-terms.component.scss']
})
export class BillingTermsComponent implements OnInit {

  merchantfiles: any[] = [];
  display: boolean = false;
  testt = "/assets/layout/images/abanner1.jpg";
  src = "/assets/Contract_Files/2019/Oct/test.pdf";
  doc = "assets/layout/images/test.pdf";


  merchantbill: Merchantbilldoc = {
    Email: null
  };

  constructor(private service: MerchantService, private local: LocalStorageService) { }

  ngOnInit() {

    this.merchantbill.Email = this.local.get("Email");
    this.service.Getmerchantbilldocs(this.merchantbill).subscribe(res => {
      this.merchantfiles = res;
    });
  }

  openpdf() {
    this.display = true;
  }

}
