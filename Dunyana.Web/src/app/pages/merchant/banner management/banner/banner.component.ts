import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsermanagementService } from 'src/app/pages/customer/services/usermanagement.service';
import { PagerService } from 'src/app/pages/customer/services/pager.service';
import { BannerDto } from '../../modal/bannerDto';
import { BannersService } from '../../services/banners.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UpdatebannerDto } from '../../modal/UpdatebannerDto';
import { DeletebannerDto } from '../../modal/DeletebannerDto';
import { LocalStorageService } from 'angular-web-storage';
import { MerchantBannerDto } from '../../modal/MerchantBannerDto';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  display: boolean = false;
  bannerslist: any[] = [];
  Totalbanners: any[] = [];
  oldbannerslist: any[] = [];
  oldbannerscopylist: any[] = [];
  Isoldbanner: boolean = false;
  Isdaterangeselect: boolean = true;
  deletebtndisable: string = "";
  noorders: boolean = true;
  nocurrentbanners: boolean = true;

  @Input() childMessage: boolean;
  @Output() displayChange = new EventEmitter();
  tocaldisable: string = "";
  webReg: string = '(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?'//'(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  englishbannerslist: any[] = [];
  arabicbannerslist: any[] = [];
  oldenglishbannerslist: any[] = [];
  oldarabicbannerslist: any[] = [];
  langbasedolditems: any[] = [];

  countries: any[] = [];
  lang: string;
  oldlang: string;
  addorupdate: boolean = true;
  header: string = "";
  secondbtn: string = "";
  rangeDates: any;
  pager: any = {};
  pagedItems: any[] = [];
  btndisable: string = "";
  response: string = "";
  responsesty: string = "";
  deleteresponse: string = "";
  informationdialog: string = "";
  isdeletedialog: boolean = false;
  Disablestartdate: boolean = false;
  Disableenddate: boolean = false;
  bannerForm: FormGroup;
  ProgressSpinnerDlg: boolean = false;
  showAdd: boolean = false;
  disabledates: any[] = [];
  minimumDate = new Date();
  minimumendDate = new Date();

  MerchantBanner: MerchantBannerDto = {
    Type: null,
    MerchantEmail: null,
    countryTimezone:null
  }

  banner: BannerDto = {
    MerchantEmail: null,
    EnglishImage: "",
    ArabicImage: "",
    BannerURL: "",
    Countries: null,
    StartDate: null,
    EndDate: null,
    BannerDescription: null,
    countryTimezone:null
  }
  updatebanner: UpdatebannerDto = {
    BannerId: 0,
    MerchantId: 0,
    EnglishImage: "",
    ArabicImage: "",
    BannerURL: null,
    Countries: null,
    StartDate: null,
    EndDate: null,
    BannerDescription: null,
    countryTimezone:null
  }

  deletebanner: DeletebannerDto = {
    BannerId: 0,
    countryTimezone:null
  }
  constructor(private userservice: UsermanagementService, private pagerService: PagerService,
    private bannerservices: BannersService, private fb: FormBuilder,
    private localStorage: LocalStorageService, ) {
  }

  ngOnInit() {

    this.bannerForm = this.fb.group({
      BannerURL: [''],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      BannerDescription: [''],
      Countries: ['Choose countries']
    });

    this.GetActiveBanners();
    this.GetOldBanners();
    this.GetCountriesList();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.lang = 'Arabic';
      this.oldlang = 'Arabic';
    });
  }
  GetCountriesList() {

    this.userservice.GetCountriesList().subscribe(res => {
      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"] })
      ));

      this.banner.Countries = this.countries[0].value;
    });
  }

  AddorUpdateclick(val, bnr) {
    this.responsesty = "";
    this.response = "";
    this.deletebtndisable = "";

    let cntryid = [];
    if (val === 'A') {
      this.tocaldisable = "";
      this.Disablestartdate = false;
      this.Disableenddate = false;

      this.Isoldbanner = false;
      cntryid.push(this.countries[0].value);
      this.bannerForm.controls["Countries"].setValue(cntryid);

      this.childMessage = true;
      this.addorupdate = false;
      this.header = "Add";
      this.secondbtn = "Cancel";
      this.minimumDate = new Date();
      this.ResetForm();
    }
    else if (val === 'U') {
      this.tocaldisable = "";
      this.minimumDate = new Date();
      this.Isoldbanner = false;
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
      this.bannerForm.controls["Countries"].setValue(cntryid);

      this.banner.ArabicImage = bnr["arabicImage"];
      this.banner.EnglishImage = bnr["englishImage"];
      this.banner.BannerDescription = bnr["bannerDescription"];
      this.updatebanner.MerchantId = bnr["merchantId"];
      this.updatebanner.BannerId = bnr["bannerId"];
      this.banner.StartDate = moment(bnr["startDate"]).format('MM/DD/YYYY HH:mm').toString();
      this.banner.EndDate = moment(bnr["endDate"]).format('MM/DD/YYYY HH:mm').toString();
      this.banner.BannerURL = bnr["bannerURL"];
      this.childMessage = true;
      this.addorupdate = false;
      this.header = "Update";
      this.secondbtn = "Delete";
    }

    else if (val === 'O') {
      this.deletebtndisable = "disable";
      this.tocaldisable = "disable";

      this.responsesty = "";
      this.response = "";
      this.Isoldbanner = true;
      let countriesids: any[] = bnr["countries"].split(',');
      countriesids.forEach(x => {
        cntryid.push(parseInt(x));
      });


      this.bannerForm.controls["Countries"].setValue(cntryid);

      this.banner.ArabicImage = bnr["arabicImage"];
      this.banner.EnglishImage = bnr["englishImage"];
      this.banner.BannerDescription = bnr["bannerDescription"];
      this.updatebanner.MerchantId = bnr["merchantId"];
      this.updatebanner.BannerId = bnr["bannerId"];
      this.banner.StartDate = moment(bnr["startDate"]).format('MM/DD/YYYY HH:mm').toString();
      this.banner.EndDate = moment(bnr["endDate"]).format('MM/DD/YYYY HH:mm').toString();
      this.banner.BannerURL = bnr["bannerURL"];
      this.childMessage = true;
      this.addorupdate = false;
      this.header = "";
    }
  }

  RedirectToList(secondbtn) {

    if (secondbtn === "Cancel") {
      this.addorupdate = true;
      this.childMessage = false;
    }
    else if (secondbtn === "Delete") {
      this.display = true;
      this.informationdialog = "Do you want to delete this banner?";
      this.isdeletedialog = false;
    }
  }

  RedirectTobannerList() {
    this.addorupdate = true;
    this.childMessage = false;
  }
  selectedLang() {
    if (this.lang === "English") {
    }
    else if (this.lang === "Arabic") {
    }
  }
  selectedoldLang() {
    if (this.oldlang === "English") {
      this.langbasedolditems = this.oldenglishbannerslist;
      this.setPage(1);

    }
    else if (this.oldlang === "Arabic") {
      this.langbasedolditems = this.oldarabicbannerslist;
      this.setPage(1);
    }
  }


  SaveAddorUpdate(header) {

    let countriescount: any[] = this.bannerForm.value["Countries"];

    if ((this.banner.ArabicImage != "") && (this.banner.EnglishImage != "")) {

      if (this.banner.BannerURL != "") {
        this.validatewebsiteurl();
      }

      if (this.banner.StartDate != null && this.banner.EndDate != null) {
        if (this.banner.BannerURL != "") {
          this.validatewebsiteurl();
        }
        else {
          if (this.banner.StartDate != "" && this.banner.EndDate != "") {
            this.responsesty = "";
            this.response = "";
            this.validatewebsiteurl();
            if (this.banner.StartDate != null && this.banner.EndDate != null) {
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
      this.response = "Please upload both banners.";
    }

    const originalbannerdata = this.banner;

    if (this.bannerForm.valid) {
      if (this.response === "") {

        if (countriescount.length != 0) {


          if (this.header === "Add") {
            this.ProgressSpinnerDlg = true;

            this.banner.Countries = "";
            let countriesids: [] = this.bannerForm.value["Countries"];

            countriesids.forEach(x => {
              this.banner.Countries = this.banner.Countries + x + ",";
            });
            this.banner.Countries = this.banner.Countries.replace(/,\s*$/, "")

            this.banner.EnglishImage = this.banner.EnglishImage.replace(/^data:image\/[a-z]+;base64,/, "");
            this.banner.ArabicImage = this.banner.ArabicImage.replace(/^data:image\/[a-z]+;base64,/, "");
            this.banner.MerchantEmail = this.localStorage.get("Email");
            this.banner.StartDate = moment(this.banner.StartDate).format('YYYY/MM/DD HH:mm').toString();
            this.banner.EndDate = moment(this.banner.EndDate).format('YYYY/MM/DD HH:mm').toString();
            this.banner.countryTimezone="Arab Standard Time";
            this.bannerservices.Addbanner(this.banner).subscribe(res => {
              this.btndisable = "disable";
              this.ProgressSpinnerDlg = false;
              this.response = res["result"];
              this.responsesty = "succsmsg";
              this.GetActiveBanners();
              this.ResetForm();
              setTimeout(() => {
                this.addorupdate = true;
                this.childMessage = false;
                this.response = "";
                this.btndisable = "line_btn sblue mr-4";
              }, 2000);

            }, error => {

              this.banner.EnglishImage = 'data:image/png;base64' + this.banner.EnglishImage;

              this.ProgressSpinnerDlg = false;

              this.response = error["error"]["result"];
              this.responsesty = "errormsg";
            });

          }

          else if (this.header === "Update") {
            let EndDate = moment(this.banner.EndDate).format('YYYY/MM/DD HH:mm').toString();
            if (EndDate <= moment(new Date()).format('YYYY/MM/DD HH:mm').toString()) {
              this.responsesty = "errormsg";
              this.response = "End date is greater than the current date.";
            }
            else {
              this.responsesty = "";
              this.response = "";
              this.ProgressSpinnerDlg = true;

              this.updatebanner.ArabicImage = this.banner.ArabicImage.replace(/^data:image\/[a-z]+;base64,/, "");
              this.updatebanner.EnglishImage = this.banner.EnglishImage.replace(/^data:image\/[a-z]+;base64,/, "");
              this.updatebanner.BannerDescription = this.banner.BannerDescription;
              this.updatebanner.BannerURL = this.banner.BannerURL;
              this.updatebanner.StartDate = moment(this.banner.StartDate).format('YYYY/MM/DD HH:mm').toString();
              this.updatebanner.EndDate = moment(this.banner.EndDate).format('YYYY/MM/DD HH:mm').toString();
              this.updatebanner.countryTimezone="Arab Standard Time";
              this.updatebanner.Countries = "";
              let countriesids: [] = this.bannerForm.value["Countries"];

              countriesids.forEach(x => {
                this.updatebanner.Countries = this.updatebanner.Countries + x + ",";
              });
              this.updatebanner.Countries = this.updatebanner.Countries.replace(/,\s*$/, "")

              this.bannerservices.Updatebanner(this.updatebanner).subscribe(res => {
                this.btndisable = "disable";
                this.ProgressSpinnerDlg = false;
                this.response = res["result"];
                this.responsesty = "succsmsg";
                this.GetActiveBanners();
                setTimeout(() => {
                  this.btndisable = "line_btn sblue mr-4";
                  this.response = "";
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
    this.banner.ArabicImage = reader.result;
    this.ProgressSpinnerDlg = false;

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
    this.banner.EnglishImage = reader.result;
    this.ProgressSpinnerDlg = false;
  }

  ResetForm() {
    this.banner.ArabicImage = "";
    this.banner.BannerDescription = "";
    this.banner.EnglishImage = "";
    this.banner.StartDate = null;
    this.banner.EndDate = null;
    this.banner.BannerURL = "";
    this.banner.Countries = this.countries[0].value;

  }


  GetActiveBanners() {
    this.MerchantBanner.Type = "A";
    this.MerchantBanner.MerchantEmail = this.localStorage.get("Email");
    this.MerchantBanner.countryTimezone=this.localStorage.get("Zone");
    //  let type = "O";
    this.bannerservices.GetbannersList(this.MerchantBanner).subscribe(res => {
      this.Totalbanners = res;
      if (this.Totalbanners.length > 0) {
        this.nocurrentbanners = true;
      }
      else {
        this.nocurrentbanners = false;
      }
      this.bannerslist = this.Totalbanners;
      if (this.bannerslist.length >= 3) {
        this.showAdd = true;
      }
      else {
        this.showAdd = false;
      }
    });
  }

  GetOldBanners() {
    this.oldenglishbannerslist.length = 0;
    this.oldarabicbannerslist.length = 0;

    this.MerchantBanner.Type = "E";
    this.MerchantBanner.MerchantEmail = this.localStorage.get("Email");
    this.bannerservices.GetbannersList(this.MerchantBanner).subscribe(res => {

      this.oldbannerslist = res;
      if (this.oldbannerslist.length > 0) {
        this.noorders = false;
      }
      else {
        this.noorders = true;
      }
      this.oldbannerscopylist = res;

      this.oldbannerslist.forEach(x => {
        if (x["englishImage"] != "") {
          this.oldenglishbannerslist.push(x);
        }
      });
      this.oldbannerslist.forEach(x => {
        if (x["arabicImage"] != "") {

          this.oldarabicbannerslist.push(x);

        }
      });
      this.langbasedolditems = this.oldarabicbannerslist;
      this.setPage(1);
    });
  }

  validatewebsiteurl() {
    if (this.banner.BannerURL != null) {
      if (this.banner.BannerURL != "") {
       // if (!this.banner.BannerURL.match(/^((https?|ftp|smtp):\/\/)?(www.)?[a-zA-Z0-9]+(\.[a-zA-Z]{2,}){1,3}(#?\/?[a-zA-Z0-9]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/)) {
        if (!this.banner.BannerURL.match(this.webReg)) {

       this.responsesty = "errormsg";
          this.response = "Please Enter valid URL.";
        }
        else {
          this.checkdates();
        }
      }
    }
  }
  filterDates() {
    this.oldenglishbannerslist.length = 0;
    this.oldarabicbannerslist.length = 0;

    if (this.rangeDates[0] !== null && this.rangeDates[1] === null) {
      let startDate = moment(this.rangeDates[0]).format('MM-DD-YYYY');
      this.oldbannerscopylist = this.oldbannerslist.filter((item: any) => {
        item["startDate"] = moment(item["startDate"]).format('MM-DD-YYYY');
        item["endDate"] = moment(item["endDate"]).format('MM-DD-YYYY');
        if (item["startDate"] === startDate || item["endDate"] === startDate) {
          return item;
        }
      });
      this.oldbannerscopylist.forEach(x => {
        if (x["englishImage"] != "") {
          this.oldenglishbannerslist.push(x);
        }
      });
      this.oldbannerscopylist.forEach(x => {
        if (x["arabicImage"] != "") {
          this.oldarabicbannerslist.push(x);
        }
      });

      if (this.oldlang === "English") {
        this.langbasedolditems = this.oldenglishbannerslist;
        this.setPage(1);
      }
      else if (this.oldlang === "Arabic") {
        this.langbasedolditems = this.oldarabicbannerslist;
        this.setPage(1);
      }

    }

    else if (this.rangeDates[0] !== null && this.rangeDates[1] !== null) {
      this.oldbannerscopylist = [];
      let startDate = moment(this.rangeDates[0]).format('MM-DD-YYYY');
      let endDate = moment(this.rangeDates[1]).format('MM-DD-YYYY');

      this.oldbannerscopylist = this.oldbannerslist.filter((item: any) => {
        item["startDate"] = moment(item["startDate"]).format('MM-DD-YYYY');
        item["endDate"] = moment(item["endDate"]).format('MM-DD-YYYY');
        if ((item["startDate"] >= startDate && item["startDate"] <= endDate) || (item["endDate"] >= startDate && item["endDate"] <= endDate)) {
          return item;
        }
      });

      this.oldbannerscopylist.forEach(x => {
        if (x["englishImage"] != "") {
          this.oldenglishbannerslist.push(x);
        }
      });
      this.oldbannerscopylist.forEach(x => {
        if (x["arabicImage"] != "") {
          this.oldarabicbannerslist.push(x);
        }
      });

      if (this.oldlang === "English") {
        this.langbasedolditems = this.oldenglishbannerslist;
        this.setPage(1);
      }
      else if (this.oldlang === "Arabic") {
        this.langbasedolditems = this.oldarabicbannerslist;
        this.setPage(1);
      }
    }

  }

  clear() {
    this.langbasedolditems.length = 0;
    this.oldarabicbannerslist.length = 0;
    this.oldenglishbannerslist.length = 0;

    this.Isdaterangeselect = true;
    this.rangeDates = "";
    this.oldbannerscopylist = this.oldbannerslist;
    this.oldbannerscopylist.forEach(x => {
      if (x["arabicImage"] != "") {
        this.oldarabicbannerslist.push(x);
      }
    });
    this.oldbannerscopylist.forEach(x => {
      if (x["englishImage"] != "") {
        this.oldenglishbannerslist.push(x);
      }
    });

    if (this.oldlang === "English") {
      this.langbasedolditems = this.oldenglishbannerslist;
      this.setPage(1);
    }
    else if (this.oldlang === "Arabic") {
      this.langbasedolditems = this.oldarabicbannerslist;
      this.setPage(1);
    }
  }

  ConfirmDeletebanner() {
    this.btndisable = "disable";
    this.ProgressSpinnerDlg = true;
    this.deletebanner.BannerId = this.updatebanner.BannerId;
    this.deletebanner.countryTimezone="Arab Standard Time";
    this.bannerservices.Deletebanner(this.deletebanner).subscribe(res => {

      this.ProgressSpinnerDlg = false;
      this.deleteresponse = res["result"];
      this.responsesty = "succsmsg";
      this.GetActiveBanners();
      setTimeout(() => {
        this.display = false;

        this.deleteresponse = "";
        this.btndisable = "line_btn sblue mr-4";
        this.addorupdate = true;
        this.childMessage = false;
      }, 2000);

    }, error => {
      this.ProgressSpinnerDlg = false;
      this.deleteresponse = error["error"]["result"];
      this.responsesty = "errormsg";
    });
  }

  closedialog() {
    this.display = false;
  }
  onClose() {
    this.displayChange.emit(false);
  }
  checkdates() {

    if (new Date(this.banner.StartDate).getDate() === (new Date().getDate())) {
      if (new Date(this.banner.StartDate).getMinutes() === (new Date().getMinutes())) {
        this.minimumDate = new Date();
        this.minimumDate.setMinutes(new Date().getMinutes() + 5);
        this.banner.StartDate = moment(this.minimumDate).format('MM/DD/YYYY HH:mm').toString();
      }
    }
    else {

    }

    if (this.banner.StartDate != null) {
      let StartDate = moment(this.banner.StartDate).format('YYYY/MM/DD HH:mm').toString();
      let CurntDate = moment(new Date()).format('YYYY/MM/DD HH:mm').toString();
      if (this.header === "Add") {
        if (StartDate <= CurntDate) {
          this.response = "Please select start date greater than the current date.";
          this.responsesty = "errormsg";
        }
        else if (this.banner.EndDate != null && this.banner.StartDate != null) {
          let EndDate = moment(this.banner.EndDate).format('YYYY/MM/DD HH:mm').toString();
          let StartDate = moment(this.banner.StartDate).format('YYYY/MM/DD HH:mm').toString();

          if (StartDate > EndDate) {
            this.response = "Please select end date greater than the start date.";
            this.responsesty = "errormsg";
          }
          else if (StartDate === EndDate) {
            this.response = "Please select end date greater than the start date.";
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
          else if (this.banner.EndDate != null && this.banner.StartDate != null) {
            let EndDate = moment(this.banner.EndDate).format('YYYY/MM/DD HH:mm').toString();
            let StartDate = moment(this.banner.StartDate).format('YYYY/MM/DD HH:mm').toString();

            if (StartDate > EndDate) {
              this.response = "Please select end date greater than the start date.";
              this.responsesty = "errormsg";
            }
            else if (StartDate === EndDate) {
              this.response = "Please select end date greater than the start date.";
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
          if (this.banner.EndDate != null && this.banner.StartDate != null) {
            let EndDate = moment(this.banner.EndDate).format('YYYY/MM/DD HH:mm').toString();
            let StartDate = moment(this.banner.StartDate).format('YYYY/MM/DD HH:mm').toString();

            if (StartDate > EndDate) {
              this.response = "Please select end date greater than the start date.";
              this.responsesty = "errormsg";
            }
            else if (StartDate === EndDate) {
              this.response = "Please select end date greater than the start date.";
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

  checkrangedates() {
    this.Isdaterangeselect = false;
  }
}
