import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LegalrequirementsService } from '../../services/legalrequirements.service';
import { MerchantAccountDto } from '../../modal/MerchantAccountDto';
import { LocalStorageService } from 'angular-web-storage';
import { MerchantAccountDetailsDto } from '../../modal/MerchantAccountDetailsDto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-legal-requirements',
  templateUrl: './legal-requirements.component.html',
  styleUrls: ['./legal-requirements.component.scss']
})
export class LegalRequirementsComponent implements OnInit {
  legalForm: FormGroup;
  response: string = "";
  responsesty: string = "";
  ContractNumber: string = "12345678";
  legalaccountdata: MerchantAccountDetailsDto = {
    id: 0,
    merchantEmail: null,
    accountCR: null,
    brandAccount: null,
    bankName: null,
    accountNumber: null,
    address: null,
    swiftcode: null
  }
  merchantdata: MerchantAccountDto = {
    merchantEmail: null
  }
  constructor(private fb: FormBuilder, private legalservice: LegalrequirementsService, private localstorage: LocalStorageService) { }

  ngOnInit() {

    // this.legalForm = this.fb.group({
    //   CR: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*')]],
    //   Brandaccount: ['', [Validators.required, Validators.pattern('^[0-9a-zA-Z \b]+$')]],
    //   Bankname: ['', [Validators.required, Validators.pattern('^[0-9a-zA-Z \b]+$')]],
    //   Accountnum: ['', [Validators.required, Validators.pattern('^[0-9]*')]],
    //   Address: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9-/_ ]*$')]],
    //   Swiftcode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*')]]
    // });

    this.legalForm = this.fb.group({
      CR: [''],
      Brandaccount: [''],
      Bankname: [''],
      Accountnum: [''],
      Address: [''],
      Swiftcode: ['']
    });
    this.GetLegalAccountDetails();
  }


  GetLegalAccountDetails() {
    this.merchantdata.merchantEmail = this.localstorage.get("Email");
    this.legalservice.GetLegalrequirements(this.merchantdata).subscribe(res => {
      this.ContractNumber = res["merchantContractNumber"];
      this.legalaccountdata.id = res["id"];
      this.legalaccountdata.merchantEmail = this.localstorage.get("Email");
      this.legalaccountdata.accountCR = res["accountCR"];
      this.legalaccountdata.accountNumber = res["accountNumber"];
      this.legalaccountdata.brandAccount = res["brandAccount"];
      this.legalaccountdata.bankName = res["bankName"];
      this.legalaccountdata.address = res["address"];
      this.legalaccountdata.swiftcode = res["swiftcode"];
      

      this.legalForm.controls['CR'].setValue(this.legalaccountdata.accountCR);
      this.legalForm.controls['Brandaccount'].setValue(this.legalaccountdata.brandAccount);
      this.legalForm.controls['Bankname'].setValue(this.legalaccountdata.bankName);
      this.legalForm.controls['Accountnum'].setValue(this.legalaccountdata.accountNumber);
      this.legalForm.controls['Address'].setValue(this.legalaccountdata.address);
      this.legalForm.controls['Swiftcode'].setValue(this.legalaccountdata.swiftcode);
    });
  }
  Updatelegaldata() {
  //  if (this.legalForm.valid) {
      this.response = "";
      this.legalaccountdata.accountCR = this.legalForm.value["CR"];
      this.legalaccountdata.brandAccount = this.legalForm.value["Brandaccount"];
      this.legalaccountdata.bankName = this.legalForm.value["Bankname"];
      this.legalaccountdata.accountNumber = this.legalForm.value["Accountnum"];
      this.legalaccountdata.address = this.legalForm.value["Address"];
      this.legalaccountdata.swiftcode = this.legalForm.value["Swiftcode"];
      this.legalservice.UpdateLegalAccountData(this.legalaccountdata).subscribe(res => {
        this.response = res["result"];
        this.responsesty = "succsmsg";
        setTimeout(() => {
          this.response = "";
          this.responsesty = "";
        }, 5000);
        this.GetLegalAccountDetails();

      },
      error=>{
        this.response = error["error"]["result"];
        this.responsesty = "errormsg";
      });
   // }
    // else {
    //   this.response = "Please enter all required fields";
    //   this.responsesty = "errormsg";
    //   setTimeout(() => {
    //     this.response = "";
    //     this.responsesty = "";
    //   }, 3000);

    // }
  }

}
