import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'angular-web-storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MessageService } from 'primeng/api';
import { RegistrationDto } from 'src/app/pages/customer/model/DTOs/RegistraionDto';
import { UsermanagementService } from 'src/app/pages/customer/services/usermanagement.service';
import { MerchantService } from '../../services/merchant.service';
import { MerchantDto } from '../../modal/MerchantDto';
import { CategoryService } from 'src/app/pages/admin/services/category.service';
import { AuthGuard } from 'src/app/shared/auth//_guards';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-merchant-edit-profile',
  templateUrl: './merchant-edit-profile.component.html',
  styleUrls: ['./merchant-edit-profile.component.scss']
})
export class MerchantEditProfileComponent implements OnInit {


  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();

  categories: any[] = [];
  selectedcategories: number[] = [];
  arrayOfValues: any[] = [];
  selectedcountry: any;
  sellcountry: any[] = [];
  SellCountries: any[] = [];

  EditprofileForm: FormGroup;
  countries: any[] = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  finalImage: any = '';
  btndisable: string = "disable";
  savebtndisable: string = "disable";
  ProgressSpinnerDlg: boolean = false;
  response: string = "";
  responsesty: string = "";
  namepattern: string = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';
  webReg: string = '(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?';

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
    oldPWD: null,
    PWD: null,
    Type: null,
    EmailVerified: 0,
    Status: 0,
    OTP: 0
  }

  _merchentFormData: MerchantDto = {
    Id: 0,
    Name: null,
    ProfileImage: null,
    Company: null,
    CompanyImage: null,
    Website: null,
    Country: null,
    Email: null,
    Categories: null,
    SellCountries: null,
    PWD: null
  }

  profiledata: any = {};
  constructor(private formBuilder: FormBuilder, private userservice: UsermanagementService,
    private localStorage: LocalStorageService, private messageService: MessageService,
    private merchantservice: MerchantService, private catservice: CategoryService,
    private authgurd:AuthGuard,private activate:ActivatedRoute,
    private router:Router) {
  }

  ngOnInit() {
    this.FormInit();
  }

  FormInit() {

    this.EditprofileForm = this.formBuilder.group({
      company: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      website: ['', [Validators.required, Validators.pattern(this.webReg)]],
      categorie: ['select categories', Validators.required],
      country: ['Select Country', Validators.required],
      sellCountries: ['', Validators.required],
    });

    this.registerdto.Email = this.localStorage.get("Email");
    this.registerdto.Type = this.localStorage.get("loginType");
    this.GetProfile();

  }
  onClose() {
    this.displayChange.emit(false);
    this.response = "";
    this.responsesty = "";
    this.ResetForm();
  }
  fileChangeEvent(event: any): void {
   
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.finalImage = reader.result;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  redirectCustomer() {
    this.onClose();
  }

  saveCropImage() {
    this.btndisable = "line_btn sblue mr-4";
    if (this.croppedImage === "") {
      this.finalImage = "";
    }
    else {
      this.finalImage = this.croppedImage;
    }

  }
  formvalidate() {

    if (this.EditprofileForm.valid) {
      this.btndisable = "line_btn sblue mr-4";
    }
    else {
      this.btndisable = "disable";
    }
  }
  dropdownvalidate(event) {
    if (this.selectedcategories.length != 0) {
      if (this.SellCountries.length != 0) {
        this.btndisable = "";
      }
      else {   
        this.btndisable = "disable";
      } 
    }
    else {   
      this.btndisable = "disable";
    }
  }

  _keyPress(event: any) {
    const pattern = /^([0-9]+ )+[0-9]+$|^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  GetCountriesList() {
    this.userservice.GetCountriesList().subscribe(res => {
      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"] })
      ));

      let cntryid;
      res.forEach(x => {
        if (x["description"] === this.profiledata["country"]) {
          cntryid = x["id"];
        }
      });
      this.EditprofileForm.controls['country'].setValue(cntryid);
    });
  }

  HideResponse() {
    setTimeout(() => {
      this.response = "";
    }, 3000);
  }

  ResetForm() {
    this.FormInit();
  }

  GetProfile() {
    this.userservice.GetProfileInformation(this.registerdto).subscribe(res => {
      this.profiledata = res;
      this.EditprofileForm.controls['company'].setValue(res["company"]);
      this.EditprofileForm.controls['website'].setValue(res["website"]);
      this.finalImage = res["companyImage"];
      this.btndisable = "line_btn sblue mr-4";
      this.GetCountriesList();
      this.bindcategories();
      this.bindcountries();
    });

  }
  bindcategories() {
    this.selectedcategories = [];
    this.categories = [];
    this.categories.length = 0;

    let catgtype = "O";
    this.catservice.CategoryList(catgtype).subscribe(res => {
      Object.keys(res).map(Key => (
        this.categories.push({ label: res[Key]["name"], value: res[Key]["id"] })
      ));
      let catgid = [];

      this.profiledata["categories"].forEach(x => {
        catgid.push(x["categoryId"]);
      });

      this.selectedcategories = catgid;
    });
  }

  bindcountries() {
    this.sellcountry.length = 0;
    this.countries = [];
    this.sellcountry = [];
    this.countries.length = 0;
    this.SellCountries = [];
    this.merchantservice.GetCountries().subscribe(res => {
      Object.keys(res).map(key => (
        this.sellcountry.push({ label: res[key]["description"], value: res[key]["id"] })

      ));
      let catgid = [];
      this.profiledata["sellCountries"].forEach(x => {
        catgid.push(x["sellCountryId"]);
      });

      this.SellCountries = catgid;
    });
  }



  updatemerchantprofile() {
    if(this.authgurd.canActivate(this.activate.snapshot,this.router.routerState.snapshot))
    {
    this.ProgressSpinnerDlg=true;
    this._merchentFormData.Categories = "";
    this._merchentFormData.SellCountries = "";
    this._merchentFormData.Id = this.profiledata["id"];
    this._merchentFormData.Company = this.EditprofileForm.value["company"];
    this._merchentFormData.CompanyImage = this.finalImage.replace(/^data:image\/[a-z]+;base64,/, "");

    this._merchentFormData.Website = this.EditprofileForm.value["website"];
    this._merchentFormData.Email = this.profiledata["email"];
    this.selectedcategories.forEach(x => {
      this._merchentFormData.Categories = this._merchentFormData.Categories + x + ",";
    })
    this._merchentFormData.Categories = this._merchentFormData.Categories.replace(/,\s*$/, "");
    this.SellCountries.forEach(x => {
      this._merchentFormData.SellCountries = this._merchentFormData.SellCountries + x + ",";
    });
    this._merchentFormData.SellCountries = this._merchentFormData.SellCountries.replace(/,\s*$/, "");

    this._merchentFormData.Country = this.EditprofileForm.value["country"];

    this.merchantservice.Updatemerchantprofile(this._merchentFormData).subscribe(res => {
      this.ProgressSpinnerDlg = false;
      this.btndisable = "disable";
      this.response = "Changes updated successfully";
      this.responsesty = "succsmsg";
      setTimeout(() => {
        this.btndisable = "";
        this.closemerchantdialog();
        this.response = "";
      }, 3000);

    },
      error => {
        this.ProgressSpinnerDlg = false;
        this.btndisable = "";
        this.response = error["error"]["result"];
        this.responsesty = "errormsg";
      });
  }
}
  closemerchantdialog() {
    this.displayChange.emit(false);
    this.response="";
  }
}
