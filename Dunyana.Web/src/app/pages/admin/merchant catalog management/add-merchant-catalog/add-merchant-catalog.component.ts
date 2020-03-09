import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { InsetMerchantCatalogDto } from '../../model/InsetMerchantCatalogDto';
import { LocalStorageService } from 'angular-web-storage';
import { MerchantCatalogService } from '../../services/merchant_catalog.service';

@Component({
  selector: 'app-add-merchant-catalog',
  templateUrl: './add-merchant-catalog.component.html',
  styleUrls: ['./add-merchant-catalog.component.scss']
})
export class AddMerchantCatalogComponent implements OnInit {

  merchantCatlogForm: FormGroup;
  btndisable: string = "disable";
  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();
  @ViewChild('adddiv') adddiv: ElementRef;

  @Input() childMessage: any[];

  responsesty: string = "";
  response: string = "";
  merchantswith_categories: any[] = [];

  categories: any[] = [];

  addcatalog: InsetMerchantCatalogDto = {
    merchantID: 0,
    type: null,
    MerchantCatalog: null
  }

  ProgressSpinnerDlg: boolean = false;

  constructor(private fb: FormBuilder,
    private categservice: CategoryService,
    private localStorage: LocalStorageService,
    private catalogservice: MerchantCatalogService, ) { }

  ngOnInit() {
    this.merchantCatlogForm = this.fb.group({
      categoryName: ['', Validators.required],
      subcategory: ['', Validators.required],
      brand: ['', Validators.required],
      product: ['', Validators.required]
    });

    this.bindcategories();
  }


  formvalidate() {
    
    if (this.merchantCatlogForm.valid) {
      this.btndisable = "line_btn sblue mr-4";
    }
    else {
      this.btndisable = "disable";
    }
  }

  hidemsgdiv() {
    setTimeout(() => {
      this.adddiv.nativeElement.innerHTML = "";
    }, 5000);
  }

  onClose() {
    this.displayChange.emit(false);
    this.ResetForm();
  }
  redirectcustomerlist() {
    this.displayChange.emit(false);
    this.ResetForm();

  }

  ResetForm() {
    this.merchantCatlogForm.reset({
      'categoryName': '',
      'subcategory': '',
      'brand': '',
      'product': ''
    });

  }
  bindcategories() {
    this.categories.length = 0;
    this.childMessage.forEach(x=>{
      this.categories.push({ label:x["categoryName"], value: x["categoryName"] })
    });
  }

  insertcatalog() {
    this.ProgressSpinnerDlg = true;

    let cataloglist: any[] = [];
    this.addcatalog.merchantID = parseInt(this.localStorage.get("merchantid"));
    this.addcatalog.type = "D";
    cataloglist.push(this.merchantCatlogForm.value);
    this.addcatalog.MerchantCatalog = cataloglist;

    this.catalogservice.Insertcatalog(this.addcatalog).subscribe(res => {
      this.ProgressSpinnerDlg = false;
      this.response = res["result"];
      this.responsesty = "succsmsg";
      this.btndisable = "disable";
      setTimeout(() => {
        this.redirectcustomerlist();
        this.ResetForm();
        this.response = "";
        this.btndisable = "";
      }, 2000);
    },
      error => {
        this.ProgressSpinnerDlg = false;
        this.btndisable = "";
        this.response = error["error"]["result"];
        this.responsesty = "errormsg";
        setTimeout(() => {
          this.response = "";
        }, 2000);
      });
  }
}
