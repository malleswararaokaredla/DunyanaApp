import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NaqelInternalTeamService } from '../../services/naqel-internal-team.service';
import { Merchant } from '../../model/Merchant';

@Component({
  selector: 'app-merchant-credit-list',
  templateUrl: './merchant-credit-list.component.html',
  styleUrls: ['./merchant-credit-list.component.scss']
})
export class MerchantCreditListComponent implements OnInit {

  cols: any;
  selectedcategory: any;
  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();
  categoryForm: FormGroup;
  countries: any[] = [];
  namepattern = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';
  btndisable = 'disable';
  credits: any[] = [];
  merchantDto: Merchant = {
    'merchantID': 0,
    'walletAmount': 0,
    'walletPoints': 0
  };
  updateMerchantlist: any = [];

  constructor(private fb: FormBuilder, private userService: UserService, private naquelService: NaqelInternalTeamService) {
    this.cols = [
      { field: 'merchantID', header: 'MERCHANT ID' },
      { field: 'merchantName', header: 'MERCHNT NAME' },
      { field: 'merchantCountry', header: 'COUNTRY' },
      { field: 'walletPoints', header: '% WALLET POINTS' },
      { field: 'walletAmount', header: '% WALLET AMOUNT' },
    ];
    this.GetCountriesList();
    this.getBonusData();
  }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      Id: ['', Validators.required],
      Name: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      points: ['', Validators.required],
      country: ['Select Country', Validators.required],
      amount: ['', Validators.required],
    });
  }

  getBonusData() {
    this.naquelService.GetMerchantBonusData().subscribe(res => {
      this.credits = res;
    });
  }

  GetCountriesList() {
    this.userService.GetCountriesList().subscribe(res => {
      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"] })

      ));
    });
  }

  updatecredits() {
    this.merchantDto.merchantID      = this.categoryForm.value['Id'];
    this.merchantDto.walletAmount    = this.categoryForm.value['amount'];
    this.merchantDto.walletPoints    = this.categoryForm.value['points'];
    this.updateMerchantlist.push(this.merchantDto);
    this.naquelService.UpdateMerchantData(this.merchantDto).subscribe(updateResponse => {
      if (updateResponse['result'].includes('success')) {
        this.display = false;
        this.getBonusData();
      }
    });
  }

  onRowSelect(event) {
    this.categoryForm.controls['Id'].setValue(event.data.merchantID);
    this.categoryForm.controls['Name'].setValue(event.data.merchantName);
    this.categoryForm.controls['amount'].setValue(event.data.walletAmount);
    this.categoryForm.controls['country'].setValue(event.data.merchantCountry);
    this.categoryForm.controls['points'].setValue(event.data.walletPoints);
    this.display = true;
    this.btndisable = "line_btn sblue mr-4";

  }

  onClose() {
    this.displayChange.emit(false);
    this.display = false;
  }

  formvalidate() {
    if (this.categoryForm.valid) {
      this.btndisable = 'line_btn sblue mr-4'; 
    } else {
      this.btndisable = 'disable';
    }
  }

  
  _keyPress(event: any) {
    const pattern = /^([0-9]+ )+[0-9]+$|^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
}
