import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Promotionals } from '../../services/Promotionals.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { UsermanagementService } from 'src/app/pages/customer/services/usermanagement.service';
import { Insertpromotions } from '../../model/Addpromotions';
import { PromotionsDto } from '../../model/promotionsDto';
import { AdminPromotionalDto } from '../../model/AdminPromotionalDto';
import { PagerService } from 'src/app/pages/customer/services/pager.service';
import { Updatepromotions } from '../../model/UpdateadminpromotionalDto';
import { DeleteAdminPromotionalDto } from '../../model/DeleteAdminPromotionalDto';
import { LocalStorageService } from 'angular-web-storage';


@Component({
  selector: 'app-promotions-list',
  templateUrl: './promotions-list.component.html',
  styleUrls: ['./promotions-list.component.scss']
})
export class PromotionsListComponent implements OnInit {
  @Input() childMessage: boolean;
  @Output() displayChange = new EventEmitter();
  display: boolean = false;
  informationdialog: string = "";
  isdeletedialog: boolean = false;
  deleteresponse: string;
  type: string;
  lang: string;
  deflang: string;
  defaultpromo: string = "";
  oldlang: string;
  Currentpromotions: any[] = [];
  promotionForm: FormGroup;
  header: string;
  response: string = "";
  responsesty: string = "";
  deletebtndisable: string = "";
  tocaldisable: string = "";
  defaultbtndisable: string = "";
  countries: any[] = [];
  ProgressSpinnerDlg: boolean = false;
  secondbtn: string = "";
  minimumDate = new Date();
  minimumendDate = new Date();
  Totalpromotions: any[] = [];
  nocurrentpromotions: boolean = true;
  currentpromotionslist: any[] = [];
  showAdd: boolean = false;
  oldenglishpromotionlist: any[] = [];
  oldarabicpromotionlist: any[] = [];
  oldpromotionslist: any[] = [];
  noorders: boolean = true;
  oldpromotionscopylist: any[] = [];
  langbasedolditems: any[] = [];
  pager: any = {};
  pagedItems: any[] = [];
  webReg: string = '(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?'//'(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  zone: string = "";

  cpager: any = {};
  cpagedItems: any[] = [];

  rangeDates: any;
  ArangeDates: any;
  Isdaterangeselect: boolean = true;
  btndisable: string = "";
  addorupdate: boolean = true;
  currentenglishpromotionlist: any[] = [];
  currentarabicpromotionlist: any[] = [];
  currentpromotionscopylist: any[] = [];
  langbasedcurrentitems: any[] = [];

  Totaldefaultpromotions: any[] = [];
  nodefaultpromotions: boolean = true;

  Isoldpromotion: boolean = false;

  promotion: PromotionsDto = {
    EnglishImage: "",
    ArabicImage: "",
    AdminPromotionalURL: "",
    Countries: null,
    StartDate: null,
    EndDate: null,
    AdminPromotionalDescription: null,
    IsDefault: null
  }


  addpromotion: Insertpromotions = {

    Countries: null,
    EnglishImage: null,
    ArabicImage: null,
    AdminPromotionalURL: null,
    AdminPromotionalDescription: null,
    Status: 0,
    IsDefault: null,
    StartDate: null,
    EndDate: null,
    CountryTimezone: null
  }
  updatepromotion: Updatepromotions = {
    PromotionalId: 0,
    Countries: null,
    EnglishImage: null,
    ArabicImage: null,
    AdminPromotionalURL: null,
    AdminPromotionalDescription: null,
    Status: 0,
    IsDefault: null,
    StartDate: null,
    EndDate: null,
    CountryTimezone: null
  }

  adminPromotionalDto: AdminPromotionalDto =
    {
      type: null,
      countryTimezone:null
    }

  deleteAdminPromotionalDto: DeleteAdminPromotionalDto = {
    promotionalId: 0,
    countryTimezone:null
  }

  constructor(private adminserivice: Promotionals, private fb: FormBuilder,
    private userservice: UsermanagementService, private pagerService: PagerService,
    private localstorage: LocalStorageService ) { }

  ngOnInit() {
    //this.zone = this.localstorage.get("Zone");
    this.zone ="Arab Standard Time";
    this.promotionForm = this.fb.group({
      AdminPromotionalURL: [''],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      AdminPromotionalDescription: [''],
      Countries: ['Choose countries']
    });

    this.lang = 'Arabic';
    this.oldlang = 'Arabic';
    this.deflang = 'Arabic';
    this.GetActivePromotions();
    this.GetCountriesList();
    this.GetDefaultpromotions();
    this.GetOldPromotions();
  }

  GetCountriesList() {

    this.userservice.GetCountriesList().subscribe(res => {
      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"] })
      ));
      this.promotion.Countries = this.countries[0].value;
    });
  }

  GetActivePromotions() {
    this.currentenglishpromotionlist.length = 0;
    this.currentarabicpromotionlist.length = 0;

    this.adminPromotionalDto.type = "A";
    this.adminPromotionalDto.countryTimezone=this.localstorage.get("Zone");
    this.ProgressSpinnerDlg = true;
    this.adminserivice.Getadminpromotionslist(this.adminPromotionalDto).subscribe(res => {
      this.Totalpromotions = res;
      this.ProgressSpinnerDlg = false;

      if (this.Totalpromotions.length > 0) {
        this.noorders = true;
      }
      else {
        this.noorders = false;

      }
      this.currentpromotionscopylist = res;

      this.Totalpromotions.forEach(x => {
        if (x["englishImage"] != "") {
          this.currentenglishpromotionlist.push(x);
        }
      });
      this.Totalpromotions.forEach(x => {
        if (x["arabicImage"] != "") {
          this.currentarabicpromotionlist.push(x);
        }
      });

      this.selectedcurrentLang();
    });
  }

  GetOldPromotions() {
    this.oldenglishpromotionlist.length = 0;
    this.oldarabicpromotionlist.length = 0;

    this.adminPromotionalDto.type = "E";
    this.adminserivice.Getadminpromotionslist(this.adminPromotionalDto).subscribe(res => {
      this.oldpromotionslist = res;
      this.oldpromotionscopylist = res;
      this.oldpromotionslist.forEach(x => {
        if (x["englishImage"] != "") {
          this.oldenglishpromotionlist.push(x);
        }
      });
      this.oldpromotionslist.forEach(x => {
        if (x["arabicImage"] != "") {
          this.oldarabicpromotionlist.push(x);
        }
      });
      this.selectedoldLang();
    });
  }

  GetDefaultpromotions() {
    this.adminPromotionalDto.type = "D";
    this.adminserivice.Getadminpromotionslist(this.adminPromotionalDto).subscribe(res => {
      this.Totaldefaultpromotions = res;
      if (this.Totaldefaultpromotions.length > 0) {
        this.nodefaultpromotions = true;
      }
      else {
        this.nodefaultpromotions = false;
      }
      if (this.Totaldefaultpromotions.length >= 1) {
        this.showAdd = true;
      }
      else {
        this.showAdd = false;
      }
    });
  }
  AddorUpdateclick(val, bnr) {

    this.responsesty = "";
    this.response = "";
    this.deletebtndisable = "";

    let cntryid = [];
    if (val === 'A') {
      this.Isoldpromotion = false;
      this.defaultpromo = "";
      this.btndisable = "";

      this.ResetForm();
      this.tocaldisable = "";
      this.promotionForm.controls["Countries"].setValue(cntryid);

      this.childMessage = true;

      this.header = "Add";
      this.secondbtn = "Cancel";
    }
    else if (val === 'U') {
      this.Isoldpromotion = false;

      this.defaultpromo = "";
      this.tocaldisable = "";
      if (new Date(moment(bnr["startDate"]).format('MM/DD/YYYY HH:mm')) > new Date()) {
        this.deletebtndisable = "";
      }
      else {
        this.deletebtndisable = "disable";
      }

      let countriesids: any[] = bnr["countries"].split(',');
      countriesids.forEach(x => {
        cntryid.push(parseInt(x));
      });
      this.promotionForm.controls["Countries"].setValue(cntryid);

      this.promotion.ArabicImage = bnr["arabicImage"];
      this.promotion.EnglishImage = bnr["englishImage"];
      this.promotion.AdminPromotionalDescription = bnr["adminPromotionalDescription"];

      this.promotion.StartDate = new Date(moment(bnr["startDate"]).format('MM/DD/YYYY HH:mm:ss').toString());

      this.promotion.EndDate = new Date(moment(bnr["endDate"]).format('MM/DD/YYYY HH:mm:ss').toString());
      this.promotion.AdminPromotionalURL = bnr["adminPromotionalURL"];
      this.updatepromotion.PromotionalId = bnr["promotionalId"];
      this.childMessage = true;

      this.header = "Update";
      this.secondbtn = "Delete";

    }

    else if (val === 'O') {
      this.Isoldpromotion = true;
      this.defaultpromo = "";
      this.deletebtndisable = "disable";
      this.tocaldisable = "disable";

      this.responsesty = "";
      this.response = "";
      let countriesids: any[] = bnr["countries"].split(',');
      countriesids.forEach(x => {
        cntryid.push(parseInt(x));
      });


      this.promotionForm.controls["Countries"].setValue(cntryid);

      this.promotion.ArabicImage = bnr["arabicImage"];
      this.promotion.EnglishImage = bnr["englishImage"];
      this.promotion.AdminPromotionalDescription = bnr["bannerDescription"];

      this.promotion.StartDate = new Date(moment(bnr["startDate"]).format('MM/DD/YYYY HH:mm:ss').toString());

      this.promotion.EndDate = new Date(moment(bnr["endDate"]).format('MM/DD/YYYY HH:mm:ss').toString());
      this.promotion.AdminPromotionalURL = bnr["bannerURL"];
      this.childMessage = true;

      this.header = "Old";
    }
    else if (val === 'D') {
      this.ResetForm();
      this.tocaldisable = "";
      this.promotionForm.controls["Countries"].setValue(cntryid);
      this.childMessage = true;
      this.header = "Add";
      this.secondbtn = "Cancel";
      this.defaultpromo = "default";
    }
    else if (val === 'Du') {
      this.Isoldpromotion = false;

      this.defaultpromo = "default";

      this.promotion.ArabicImage = bnr["arabicImage"];
      this.promotion.EnglishImage = bnr["englishImage"];
      this.promotion.AdminPromotionalDescription = bnr["adminPromotionalDescription"];

      this.promotion.AdminPromotionalURL = bnr["adminPromotionalURL"];
      this.updatepromotion.PromotionalId = bnr["promotionalId"];
      this.childMessage = true;

      this.header = "Update";
      this.secondbtn = "Delete";
    }
  }

  RedirectTobannerList() {

    this.childMessage = false;
  }

  engfileChangeEvent(event: any): void {

    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      return;
    }
    this.ProgressSpinnerDlg = true;
    reader.onload = this._handleengReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleengReaderLoaded(e) {
    let reader = e.target;
    this.promotion.EnglishImage = reader.result;
    this.ProgressSpinnerDlg = false;
  }

  fileChangeEvent(event: any): void {

    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      return;
    }
    this.ProgressSpinnerDlg = true;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.promotion.ArabicImage = reader.result;
    this.ProgressSpinnerDlg = false;

  }


  SaveAddorUpdate(header) {
    this.response = "";

    let countriescount: any[] = this.promotionForm.value["Countries"];
    if (this.defaultpromo != "default") {
      if ((this.promotion.ArabicImage != "") && (this.promotion.EnglishImage != "")) {

        if (this.promotion.AdminPromotionalURL != "") {
          this.validatewebsiteurl();
        }

        if (this.promotion.StartDate != null && this.promotion.EndDate != null) {
          if (this.promotion.AdminPromotionalURL != "") {
            this.validatewebsiteurl();
          }
          else {
            if (this.promotion.StartDate.toString() != "" && this.promotion.EndDate.toString() != "") {
              this.responsesty = "";
              this.response = "";
              this.validatewebsiteurl();
              if (this.promotion.StartDate != null && this.promotion.EndDate != null) {
                this.checkdates();
              }
            }
            else {
              this.responsesty = "errormsg";
              this.response = "Please select start date & end date.";
            }
          }

        }
        else {

          this.responsesty = "errormsg";
          this.response = "Please select start date & end date.";

        }
      }
      else {
        this.responsesty = "errormsg";
        this.response = "Please upload both promotions images.";
      }
      if (this.promotionForm.valid) {
        if (this.response === "") {
          if (countriescount.length != 0) {

            if (this.header === "Add") {
              this.btndisable = "disable";
              this.ProgressSpinnerDlg = true;
              this.promotion.Countries = "";
              let countriesids: [] = this.promotionForm.value["Countries"];

              countriesids.forEach(x => {
                this.promotion.Countries = this.promotion.Countries + x + ",";
              });
              this.addpromotion.Countries = this.promotion.Countries.replace(/,\s*$/, "")

              this.addpromotion.EnglishImage = this.promotion.EnglishImage.replace(/^data:image\/[a-z]+;base64,/, "");
              this.addpromotion.ArabicImage = this.promotion.ArabicImage.replace(/^data:image\/[a-z]+;base64,/, "");
              this.addpromotion.StartDate = moment(this.promotion.StartDate).format('YYYY/MM/DD HH:mm:ss').toString();
              this.addpromotion.EndDate = moment(this.promotion.EndDate).format('YYYY/MM/DD HH:mm:ss').toString();
              this.addpromotion.AdminPromotionalURL = this.promotion.AdminPromotionalURL;
              this.addpromotion.AdminPromotionalDescription = this.promotion.AdminPromotionalDescription.trim();
              this.addpromotion.IsDefault = "0";
              this.addpromotion.CountryTimezone = this.zone;
              this.adminserivice.Addpromotions(this.addpromotion).subscribe(res => {
                this.response = res["result"];
                this.responsesty = "succsmsg";
                this.ProgressSpinnerDlg = false;
                this.GetActivePromotions();
                this.ResetForm();
                setTimeout(() => {
                  this.addorupdate = true;
                  this.childMessage = false;
                  this.response = "";
                  this.btndisable = "line_btn sblue mr-4";
                }, 2000);

              }, error => {
                this.ProgressSpinnerDlg = false;
                this.response = error["error"]["result"];
                this.responsesty = "errormsg";
              });
            }

            else if (this.header === "Update") {
              let EndDate = moment(this.promotion.EndDate).format('YYYY/MM/DD HH:mm:ss').toString();
              if (EndDate <= moment(new Date()).format('YYYY/MM/DD HH:mm:ss').toString()) {
                this.responsesty = "errormsg";
                this.response = "End date is greater than the current date.";
              }
              else {
                this.responsesty = "";
                this.response = "";
                this.btndisable = "disable";

                this.ProgressSpinnerDlg = true;

                this.updatepromotion.ArabicImage = this.promotion.ArabicImage.replace(/^data:image\/[a-z]+;base64,/, "");
                this.updatepromotion.EnglishImage = this.promotion.EnglishImage.replace(/^data:image\/[a-z]+;base64,/, "");
                this.updatepromotion.AdminPromotionalDescription = this.promotion.AdminPromotionalDescription.trim();
                this.updatepromotion.AdminPromotionalURL = this.promotion.AdminPromotionalURL;
                this.updatepromotion.StartDate = moment(this.promotion.StartDate).format('YYYY/MM/DD HH:mm:ss').toString();
                this.updatepromotion.EndDate = moment(this.promotion.EndDate).format('YYYY/MM/DD HH:mm:ss').toString();
                this.updatepromotion.Countries = "";
                let countriesids: [] = this.promotionForm.value["Countries"];

                countriesids.forEach(x => {
                  this.updatepromotion.Countries = this.updatepromotion.Countries + x + ",";
                });
                this.updatepromotion.Countries = this.updatepromotion.Countries.replace(/,\s*$/, "")

                this.updatepromotion.CountryTimezone = this.zone;
                this.adminserivice.Updatepromotions(this.updatepromotion).subscribe(res => {
                  this.ProgressSpinnerDlg = false;
                  this.response = res["result"];
                  this.responsesty = "succsmsg";
                  this.GetActivePromotions();
                  setTimeout(() => {
                    this.btndisable = "line_btn sblue mr-4";
                    this.response = "";
                    this.addorupdate = true;
                    this.childMessage = false;
                    this.ResetForm();
                  }, 2000);

                }, error => {
                  this.ProgressSpinnerDlg = false;
                  this.response = error["error"]["result"];
                  this.responsesty = "errormsg";

                });
              }
            }
          }
          else {
            this.response = "Please select atleast one country."
            this.responsesty = "errormsg";
          }
        }
      }
    }
    else if (this.defaultpromo === "default") {
      if ((this.promotion.ArabicImage != "") && (this.promotion.EnglishImage != "")) {
        this.response = "";
        if (this.promotion.AdminPromotionalURL != "") {
          this.validatewebsiteurl();
        }
      }
      else {
        this.responsesty = "errormsg";
        this.response = "Please upload both promotions images.";
      }

      if (this.response === "") {
        this.ProgressSpinnerDlg = true;
        this.btndisable = "disable";
        this.addpromotion.Countries = "";

        this.addpromotion.EnglishImage = this.promotion.EnglishImage.replace(/^data:image\/[a-z]+;base64,/, "");
        this.addpromotion.ArabicImage = this.promotion.ArabicImage.replace(/^data:image\/[a-z]+;base64,/, "");
        this.addpromotion.StartDate = moment(new Date().toString()).format('YYYY/MM/DD HH:mm:ss').toString();
        this.addpromotion.EndDate = moment(new Date().toString()).format('YYYY/MM/DD HH:mm:ss').toString();
        this.addpromotion.AdminPromotionalURL = this.promotion.AdminPromotionalURL;
        this.addpromotion.AdminPromotionalDescription = this.promotion.AdminPromotionalDescription.trim();
        this.addpromotion.IsDefault = "1";
        this.addpromotion.CountryTimezone = this.zone;
        if (header === "Add") {
          this.adminserivice.Addpromotions(this.addpromotion).subscribe(res => {
            this.ProgressSpinnerDlg = false;
            this.response = res["result"];
            this.responsesty = "succsmsg";
            this.GetDefaultpromotions();
            setTimeout(() => {
              this.ResetForm();
              this.addorupdate = true;
              this.childMessage = false;
              this.response = "";
              this.btndisable = "line_btn sblue mr-4";
              this.ProgressSpinnerDlg = false;

            }, 2000);

          }, error => {
            this.ProgressSpinnerDlg = false;
            this.response = error["error"]["result"];
            this.responsesty = "errormsg";
          });
        }
        else if (header === "Update") {
          this.btndisable = "disable";

          this.ProgressSpinnerDlg = true;

          this.updatepromotion.ArabicImage = this.promotion.ArabicImage.replace(/^data:image\/[a-z]+;base64,/, "");
          this.updatepromotion.EnglishImage = this.promotion.EnglishImage.replace(/^data:image\/[a-z]+;base64,/, "");
          this.updatepromotion.AdminPromotionalDescription = this.promotion.AdminPromotionalDescription.trim();
          this.updatepromotion.AdminPromotionalURL = this.promotion.AdminPromotionalURL;
          this.updatepromotion.StartDate = moment(new Date().toString()).format('YYYY/MM/DD HH:mm:ss').toString();
          this.updatepromotion.EndDate = moment(new Date().toString()).format('YYYY/MM/DD HH:mm:ss').toString();

          this.updatepromotion.Countries = "";
          this.updatepromotion.CountryTimezone = this.zone;

          this.adminserivice.Updatepromotions(this.updatepromotion).subscribe(res => {
            this.ProgressSpinnerDlg = false;
            this.response = res["result"];
            this.responsesty = "succsmsg";
            this.GetDefaultpromotions();
            setTimeout(() => {
              this.btndisable = "line_btn sblue mr-4";
              this.response = "";
              this.addorupdate = true;
              this.childMessage = false;
              this.ResetForm();
            }, 2000);

          }, error => {
            this.ProgressSpinnerDlg = false;
            this.response = error["error"]["result"];
            this.responsesty = "errormsg";

          });
        }

      }
    }
  }
  validatewebsiteurl() {
    if (this.promotion.AdminPromotionalURL != null) {
      if (this.promotion.AdminPromotionalURL != "") {
       // if (!this.promotion.AdminPromotionalURL.match(/^((https?|ftp|smtp):\/\/)?(www.)?[a-zA-Z0-9]+(\.[a-zA-Z]{2,}){1,3}(#?\/?[a-zA-Z0-9]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/)) {
          if (!this.promotion.AdminPromotionalURL.match(this.webReg)) {
          this.responsesty = "errormsg";
          this.response = "Please Enter valid URL.";
        }
        else {
          this.checkdates();
        }
      }

    }
  }

  checkdates() {

    if (new Date(this.promotion.StartDate).getDate() === (new Date().getDate())) {
      if (new Date(this.promotion.StartDate).getMinutes() === (new Date().getMinutes())) {
        this.minimumDate = new Date();
        this.minimumDate.setMinutes(new Date().getMinutes() + 5);
        this.promotion.StartDate = new Date(moment(this.minimumDate).format('MM/DD/YYYY HH:mm').toString());
      }
    }
    else {
    }

    if (this.promotion.StartDate != null) {
      let StartDate = moment(this.promotion.StartDate).format('YYYY/MM/DD HH:mm:ss').toString();
      let CurntDate = moment(new Date()).format('YYYY/MM/DD HH:mm:ss').toString();
      if (this.header === "Add") {
        if (StartDate <= CurntDate) {
          this.response = "Please select start date greater than the current date.";
          this.responsesty = "errormsg";
        }
        else if (this.promotion.EndDate != null && this.promotion.StartDate != null) {
          let EndDate = moment(this.promotion.EndDate).format('YYYY/MM/DD HH:mm:ss').toString();
          let StartDate = moment(this.promotion.StartDate).format('YYYY/MM/DD HH:mm:ss').toString();

          if (StartDate > EndDate) {
            this.response = "End date should be greater than Start date.";
            this.responsesty = "errormsg";
          }
          else if (StartDate === EndDate) {
            this.response = "End date should be greater than Start date.";
            this.responsesty = "errormsg";
          }
          else {
            this.response = "";
            this.responsesty = "";
          }
        }
        else {
          this.response = "";
          this.responsesty = "";
        }
      }
      else if (this.header === "Update") {
        if (this.deletebtndisable.length == 0) {
          if (StartDate <= CurntDate) {
            this.response = "Please select start date greater than the current date.";
            this.responsesty = "errormsg";
          }
          else if (this.promotion.EndDate != null && this.promotion.StartDate != null) {
            let EndDate = moment(this.promotion.EndDate).format('YYYY/MM/DD HH:mm:ss').toString();
            let StartDate = moment(this.promotion.StartDate).format('YYYY/MM/DD HH:mm:ss').toString();

            if (StartDate > EndDate) {
              this.response = "End date should be greater than Start date.";
              this.responsesty = "errormsg";
            }
            else if (StartDate === EndDate) {
              this.response = "End date should be greater than Start date.";
              this.responsesty = "errormsg";
            }
            else {
              this.response = "";
              this.responsesty = "";
            }
          }
          else {
            this.response = "";
            this.responsesty = "";
          }
        }
        else if (this.deletebtndisable.length > 0) {
          if (this.promotion.EndDate != null && this.promotion.StartDate != null) {
            let EndDate = moment(this.promotion.EndDate).format('YYYY/MM/DD HH:mm:ss').toString();
            let StartDate = moment(this.promotion.StartDate).format('YYYY/MM/DD HH:mm:ss').toString();

            if (StartDate > EndDate) {
              this.response = "End date should be greater than Start date.";
              this.responsesty = "errormsg";
            }
            else if (StartDate === EndDate) {
              this.response = "End date should be greater than Start date.";
              this.responsesty = "errormsg";
            }
            else {
              this.response = "";
              this.responsesty = "";
            }
          }
          else {
            this.response = "";
            this.responsesty = "";
          }
        }
      }
    }
  }

  setPage(page: number) {

    this.pager = this.pagerService.getPager(this.langbasedolditems.length, page, 3);
    this.pagedItems = this.langbasedolditems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    if (this.pagedItems.length > 0) {
      this.noorders = true;
    }
    else {
      this.noorders = false;
    }
  }
  setPageforcurrentpromotions(page: number) {

    this.ProgressSpinnerDlg = true;
    this.cpager = this.pagerService.getPager(this.langbasedcurrentitems.length, page, 3);
    this.cpagedItems = this.langbasedcurrentitems.slice(this.cpager.startIndex, this.cpager.endIndex + 1);

    if (this.cpagedItems.length > 0) {
      this.noorders = true;
      this.ProgressSpinnerDlg = false;

    }
    else {
      this.noorders = false;
      this.ProgressSpinnerDlg = false;

    }
  }

  checkrangedates() {
    this.Isdaterangeselect = false;
  }
  filterDates() {
    this.oldenglishpromotionlist.length = 0;
    this.oldarabicpromotionlist.length = 0;

    if (this.rangeDates[0] !== null && this.rangeDates[1] === null) {
      let startDate = moment(this.rangeDates[0]).format('MM-DD-YYYY');
      this.oldpromotionscopylist = this.oldpromotionslist.filter((item: any) => {
        item["startDate"] = moment(item["startDate"]).format('MM-DD-YYYY');
        item["endDate"] = moment(item["endDate"]).format('MM-DD-YYYY');
        if (item["startDate"] === startDate || item["endDate"] === startDate) {
          return item;
        }
      });
      this.oldpromotionscopylist.forEach(x => {
        if (x["englishImage"] != "") {
          this.oldenglishpromotionlist.push(x);
        }
      });
      this.oldpromotionscopylist.forEach(x => {
        if (x["arabicImage"] != "") {
          this.oldarabicpromotionlist.push(x);
        }
      });

      if (this.oldlang === "English") {
        this.langbasedolditems = this.oldenglishpromotionlist;
        this.setPage(1);
      }
      else if (this.oldlang === "Arabic") {
        this.langbasedolditems = this.oldarabicpromotionlist;
        this.setPage(1);
      }
    }

    else if (this.rangeDates[0] !== null && this.rangeDates[1] !== null) {
      this.oldpromotionscopylist = [];
      let startDate = moment(this.rangeDates[0]).format('MM-DD-YYYY');
      let endDate = moment(this.rangeDates[1]).format('MM-DD-YYYY');

      this.oldpromotionscopylist = this.oldpromotionslist.filter((item: any) => {
        item["startDate"] = moment(item["startDate"]).format('MM-DD-YYYY');
        item["endDate"] = moment(item["endDate"]).format('MM-DD-YYYY');
        if ((item["startDate"] >= startDate && item["startDate"] <= endDate) || (item["endDate"] >= startDate && item["endDate"] <= endDate)) {
          return item;
        }
      });

      this.oldpromotionscopylist.forEach(x => {
        if (x["englishImage"] != "") {
          this.oldenglishpromotionlist.push(x);
        }
      });
      this.oldpromotionscopylist.forEach(x => {
        if (x["arabicImage"] != "") {
          this.oldarabicpromotionlist.push(x);
        }
      });

      if (this.oldlang === "English") {
        this.langbasedolditems = this.oldenglishpromotionlist;
        this.setPage(1);
      }
      else if (this.oldlang === "Arabic") {
        this.langbasedolditems = this.oldarabicpromotionlist;
        this.setPage(1);
      }
    }

  }
  currentfilterDates() {
    this.currentenglishpromotionlist.length = 0;
    this.currentarabicpromotionlist.length = 0;

    if (this.ArangeDates[0] !== null && this.ArangeDates[1] === null) {
      let startDate = moment(this.ArangeDates[0]).format('MM-DD-YYYY');
      this.oldpromotionscopylist = this.oldpromotionslist.filter((item: any) => {
        item["startDate"] = moment(item["startDate"]).format('MM-DD-YYYY');
        item["endDate"] = moment(item["endDate"]).format('MM-DD-YYYY');
        if (item["startDate"] === startDate && item["endDate"] === startDate) {
          return item;
        }
      });
      this.oldpromotionscopylist.forEach(x => {
        if (x["englishImage"] != "") {
          this.currentenglishpromotionlist.push(x);
        }
      });
      this.oldpromotionscopylist.forEach(x => {
        if (x["arabicImage"] != "") {
          this.currentarabicpromotionlist.push(x);
        }
      });

      if (this.oldlang === "English") {
        this.langbasedolditems = this.currentenglishpromotionlist;
        this.setPage(1);
      }
      else if (this.oldlang === "Arabic") {
        this.langbasedolditems = this.currentarabicpromotionlist;
        this.setPage(1);
      }
    }

    else if (this.ArangeDates[0] !== null && this.ArangeDates[1] !== null) {
      this.oldpromotionscopylist = [];
      let startDate = moment(this.ArangeDates[0]).format('MM-DD-YYYY');
      let endDate = moment(this.ArangeDates[1]).format('MM-DD-YYYY');

      this.oldpromotionscopylist = this.oldpromotionslist.filter((item: any) => {
        item["startDate"] = moment(item["startDate"]).format('MM-DD-YYYY');
        item["endDate"] = moment(item["endDate"]).format('MM-DD-YYYY');
        if (item["startDate"] >= startDate && item["endDate"] <= endDate) {
          return item;
        }
      });

      this.oldpromotionscopylist.forEach(x => {
        if (x["englishImage"] != "") {
          this.currentenglishpromotionlist.push(x);
        }
      });
      this.oldpromotionscopylist.forEach(x => {
        if (x["arabicImage"] != "") {
          this.currentarabicpromotionlist.push(x);
        }
      });

      if (this.oldlang === "English") {
        this.langbasedolditems = this.currentenglishpromotionlist;
        this.setPage(1);
      }
      else if (this.oldlang === "Arabic") {
        this.langbasedolditems = this.currentarabicpromotionlist;
        this.setPage(1);
      }
    }

  }

  selectedoldLang() {
    if (this.oldlang === "English") {
      this.langbasedolditems = this.oldenglishpromotionlist;
      this.setPage(1);
    }
    else if (this.oldlang === "Arabic") {
      this.langbasedolditems = this.oldarabicpromotionlist;
      this.setPage(1);
    }
  }
  selectedcurrentLang() {

    if (this.lang === "English") {
      this.langbasedcurrentitems = this.currentenglishpromotionlist;
      this.setPageforcurrentpromotions(1);
    }
    else if (this.lang === "Arabic") {
      this.langbasedcurrentitems = this.currentarabicpromotionlist;
      this.setPageforcurrentpromotions(1);
    }

  }
  clear() {
    this.langbasedolditems.length = 0;
    this.oldarabicpromotionlist.length = 0;
    this.oldenglishpromotionlist.length = 0;

    this.Isdaterangeselect = true;
    this.rangeDates = "";
    this.oldpromotionscopylist = this.oldpromotionslist;
    this.oldpromotionscopylist.forEach(x => {
      if (x["arabicImage"] != "") {
        this.oldarabicpromotionlist.push(x);
      }
    });
    this.oldpromotionscopylist.forEach(x => {
      if (x["englishImage"] != "") {
        this.oldenglishpromotionlist.push(x);
      }
    });

    if (this.oldlang === "English") {
      this.langbasedolditems = this.oldenglishpromotionlist;
      this.setPage(1);
    }
    else if (this.oldlang === "Arabic") {
      this.langbasedolditems = this.oldarabicpromotionlist;
      this.setPage(1);
    }
  }

  ResetForm() {
    this.promotion.ArabicImage = "";
    this.promotion.AdminPromotionalURL = "";
    this.promotion.EnglishImage = "";
    this.promotion.StartDate = null;
    this.promotion.EndDate = null;
    this.promotion.AdminPromotionalDescription = "";
    this.promotion.Countries = this.countries[0].value;
    // this.responsesty = "";
    // this.response = "";
  }

  RedirectToList(secondbtn) {

    if (secondbtn === "Cancel") {
      this.addorupdate = true;
      this.childMessage = false;
      this.ResetForm();
    }
    else if (secondbtn === "Delete") {
      this.display = true;
      this.informationdialog = "Do you want to delete this promotion?";
      this.isdeletedialog = false;
    }
  }

  closedialog() {
    this.display = false;
  }

  ConfirmDeletepromotion() {
    this.btndisable = "disable";
    this.ProgressSpinnerDlg = true;
    this.deleteAdminPromotionalDto.promotionalId = this.updatepromotion.PromotionalId;
    this.deleteAdminPromotionalDto.countryTimezone="Arab Standard Time";
    this.adminserivice.Deletepromotion(this.deleteAdminPromotionalDto).subscribe(res => {

      this.ProgressSpinnerDlg = false;
      this.deleteresponse = res["result"];
      this.responsesty = "succsmsg";
      if (this.defaultpromo === "") {
        this.GetActivePromotions();
      }
      else {
        this.GetDefaultpromotions();
      }
      setTimeout(() => {
        this.display = false;

        this.deleteresponse = "";
        this.addorupdate = true;
        this.childMessage = false;
        this.btndisable = "line_btn sblue mr-4";

      }, 2000);

    }, error => {
      this.ProgressSpinnerDlg = false;
      this.deleteresponse = error["error"]["result"];
      this.responsesty = "errormsg";
    });
  }

  onClose() {
    this.displayChange.emit(false);
  }
}
