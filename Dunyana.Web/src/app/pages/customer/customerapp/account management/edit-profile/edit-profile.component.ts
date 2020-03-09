import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationDto } from '../../../model/DTOs/RegistraionDto';
import { UsermanagementService } from '../../../services/usermanagement.service';
import { LocalStorageService } from 'angular-web-storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth//_guards';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();

  EditprofileForm: FormGroup;
  countries: any[] = [];
  imageChangedEvent: any = '';
  croppedImage: any = '';
  finalImage: any = '';
  btndisable: string = "disable";
  savebtndisable: string = "disable";
  editProgressSpinnerDlg: boolean = false;
  response: string = "";
  responsesty: string = "";
  country: string = "";
  removeicon: boolean = false;

  namepattern: string = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';

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
  profiledata = this.registerdto;

  constructor(private formBuilder: FormBuilder, private userservice: UsermanagementService,
    private localStorage: LocalStorageService, private messageService: MessageService,
    private router: Router, private authgurd: AuthGuard, private activate: ActivatedRoute,

  ) {
  }

  ngOnInit() {

    this.FormInit();
  }

  FormInit() {

    this.EditprofileForm = this.formBuilder.group({

      firstname: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      lastname: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      mobile: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      address: ['', [Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
      country: ['', Validators.required],
      city: ['', [Validators.required, Validators.pattern(this.namepattern)]],
    });


    this.registerdto.Email = this.localStorage.get("Email");
    this.registerdto.Type = this.localStorage.get("loginType");
    this.GetProfile();


  }
  onClose() {
    this.displayChange.emit(false);
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
    this.removeicon = false;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  redirectCustomer() {
    this.displayChange.emit(false);
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

  _keyPress(event: any) {
    const pattern = /^([0-9]+ )+[0-9]+$|^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  GetCountriesList() {
    this.countries.length = 0;
    this.userservice.GetCountriesList().subscribe(res => {

      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"] })
      ));

      let catid;

      this.countries.forEach(x => {
        if (x["label"] === this.country) {
          catid = x["value"];
        }
      });
      this.EditprofileForm.controls['country'].setValue(this.country);
    });

  }


  Updateprofiledata() {
    let catid;

    this.countries.forEach(x => {
      if (x["label"] === this.country) {
        catid = x["value"];
      }
    });
    if (this.authgurd.canActivate(this.activate.snapshot, this.router.routerState.snapshot)) {
      this.editProgressSpinnerDlg = true;
      this.profiledata.Image = this.finalImage.replace(/^data:image\/[a-z]+;base64,/, "");
      this.profiledata.FirstName = this.EditprofileForm.value["firstname"];
      this.profiledata.LastName = this.EditprofileForm.value["lastname"];
      this.profiledata.City = this.EditprofileForm.value["city"];
      this.profiledata.Address = this.EditprofileForm.value["address"];
      this.profiledata.Address = this.profiledata.Address.trim();
      this.profiledata.Country =catid;
      this.profiledata.Mobile = this.EditprofileForm.value["mobile"];
      this.userservice.UpdateCustomerProfileData(this.profiledata).subscribe(res => {
        this.response = "Changes updated successfully";
        this.responsesty = "succsmsg";
        this.HideResponse();
        this.btndisable = "disable";
        setTimeout(() => {
          this.btndisable = "";
          this.redirectCustomer();

        }, 3000);

        this.editProgressSpinnerDlg = false;
      },
        error => {
          this.editProgressSpinnerDlg = false;
          this.response = "Something Went Wrong Please Try Again";
          this.responsesty = "errormsg";
          setTimeout(() => {
            this.redirectCustomer();
          }, 3000);

        });
    }
  }

  HideResponse() {
    setTimeout(() => {
      this.response = "";
    }, 3000);
  }

  ResetForm() {
    this.GetProfile();
  }

  GetProfile() {
    this.userservice.GetProfileInformation(this.registerdto).subscribe(res => {

      this.profiledata.Id = res["id"];
      this.EditprofileForm.controls['firstname'].setValue(res["firstName"]);
      this.EditprofileForm.controls['lastname'].setValue(res["lastName"]);
      this.EditprofileForm.controls['mobile'].setValue(res["mobile"]);
      this.EditprofileForm.controls['address'].setValue(res["address"]);
      this.country = res["country"];

      this.EditprofileForm.controls['city'].setValue(res["city"]);
      this.finalImage = res["image"];
      let filename=this.GetFilename(this.finalImage);
      filename=filename.toString();
      if (this.finalImage != null && this.finalImage != "" && filename!="Dummy") {
        this.removeicon = false;
      }
      else {
        this.removeicon = true;

      }
      this.btndisable = "line_btn sblue mr-4";

      this.GetCountriesList();
    });

  }

  removeprofileimage() {
    this.finalImage = "";
    this.removeicon = true;
  }
 GetFilename(url)
  {
     if (url)
     {
        var m = url.toString().match(/.*\/(.+?)\./);
        if (m && m.length > 1)
        {
           return m[1];
        }
     }
     return "";
  }
}
