import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'angular-web-storage';
import { PagerService } from 'src/app/pages/customer/services/pager.service';
import * as moment from 'moment';
import { UsermanagementService } from 'src/app/pages/customer/services/usermanagement.service';
import { DealsDto } from '../../modal/DealsDto';
import { DeletebannerDto } from '../../modal/DeletebannerDto';
import { MerchantBannerDto } from '../../modal/MerchantBannerDto';
import { DealsService } from '../../services/deals.service';
import { UpdateDealsDto } from '../../modal/UpdatedealDto';
import { DeletedealDto } from '../../modal/DeletedealDto';

@Component({
  selector: 'app-deals-promotions',
  templateUrl: './deals-promotions.component.html',
  styleUrls: ['./deals-promotions.component.scss']
})
export class DealsPromotionsComponent implements OnInit {

  display: boolean = false;

  bannerslist: any[] = [];
  Totalbanners: any[] = [];
  oldbannerslist: any[] = [];
  oldbannerscopylist: any[] = [];
  Isoldbanner: boolean = false;
  Isdaterangeselect: boolean = true;
  deletebtndisable: string = "";
  tocaldisable: string = "";
  noolddeals: boolean = true;
  nocurrentdeals: boolean = true;

  @Input() childMessage: boolean;
  @Output() displayChange = new EventEmitter();

  englishbannerslist: any[] = [];
  arabicbannerslist: any[] = [];
  oldenglishbannerslist: any[] = [];
  oldarabicbannerslist: any[] = [];
  langbasedolditems: any[] = [];

  engbannerimg: string = "";
  arabbannerimg: string = "";

  countries: any[] = [];
  dlang: string;

  doldlang: string;
  addorupdate: boolean = true;
  header: string = "";
  secondbtn: string = "";

  selectedcountry: string = "";
  rangeDates: any;
  pager: any = {};
  pagedItems: any[] = [];
  btndisable: string = "";
  response: string = "";
  responsesty: string = "";
  deleteresponse: string = "";
  informationdialog: string = "";
  isdeletedialog: boolean = false;
  isempty: boolean = false;

  // webReg: string = '(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?';
  webReg: string = '(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?'//'(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  namepattern: string = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';

  bannerForm: FormGroup;
  ProgressSpinnerDlg: boolean = false;
  showAdd: boolean = false;
  disabledates: any[] = [];
  minimumDate = new Date();
  minimumendDate = new Date();

  // MerchantBanner: MerchantBannerDto = {
  //   Type: null,
  //   MerchantEmail: null,
  //   countryTimezone:null

  // }

  MerchantDeals: MerchantBannerDto = {
    Type: null,
    MerchantEmail: null,
    countryTimezone:null
  }

  deals: DealsDto = {
    MerchantEmail: null,
    EnglishImage: "",
    ArabicImage: "",
    DealURL: null,
    Countries: null,
    StartDate: null,
    EndDate: null,
    DealDescription: null,
    DealName: null,
    DealCode: null,
    countryTimezone:null
  }

  updatedeals: UpdateDealsDto = {
    DealId: 0,
    MerchantId: 0,
    EnglishImage: "",
    ArabicImage: "",
    DealURL: null,
    Countries: null,
    StartDate: null,
    EndDate: null,
    DealDescription: null,
    DealName: null,
    DealCode: null,
    countryTimezone:null
  }

  deletedeal: DeletedealDto = {
    DealId: 0,
    countryTimezone:null
  }
  constructor(private userservice: UsermanagementService, private pagerService: PagerService,
   private fb: FormBuilder, private delaservice: DealsService,
    private localStorage: LocalStorageService) {
  }

  ngOnInit() {

    this.bannerForm = this.fb.group({
      BannerURL: [''],
      Name: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      BannerDescription: [''],
      Countries: ['']
    });

    this.GetActiveBanners();
    this.GetOldBanners();
    this.GetCountriesList();

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.dlang = 'Arabic';
      this.doldlang = 'Arabic';
    });
  }
  GetCountriesList() {

    this.userservice.GetCountriesList().subscribe(res => {
      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"] })
      ));
      this.deals.Countries = this.countries[0].value;
    });
  }

  AddorUpdateclick(val, bnr) {
    this.response = "";
    this.deletebtndisable = "";
    let cntryid = [];
    if (val === 'A') {
      this.tocaldisable = "";
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

      this.deals.ArabicImage = bnr["arabicImage"];
      this.deals.EnglishImage = bnr["englishImage"];
      this.deals.DealName = bnr["dealName"];
      this.deals.DealDescription = bnr["dealDescription"];
      this.updatedeals.MerchantId = bnr["merchantId"];
      this.updatedeals.DealId = bnr["dealId"];
      this.deals.StartDate = moment(bnr["startDate"]).format('MM/DD/YYYY HH:mm').toString();

      this.deals.EndDate = moment(bnr["endDate"]).format('MM/DD/YYYY HH:mm').toString();
      this.deals.DealURL = bnr["dealURL"];
      this.childMessage = true;
      this.addorupdate = false;
      this.header = "Update";
      this.secondbtn = "Delete";
    }

    else if (val === 'O') {
      this.tocaldisable = "disable";
      this.deletebtndisable = "disable";
      this.responsesty = "";
      this.response = "";
      this.Isoldbanner = true;
      let countriesids: any[] = bnr["countries"].split(',');
      countriesids.forEach(x => {
        cntryid.push(parseInt(x));
      });


      this.bannerForm.controls["Countries"].setValue(cntryid);

      this.deals.ArabicImage = bnr["arabicImage"];
      this.deals.EnglishImage = bnr["englishImage"];
      this.deals.DealDescription = bnr["dealDescription"];
      this.updatedeals.MerchantId = bnr["merchantId"];
      this.updatedeals.DealId = bnr["dealId"];
      this.deals.DealName = bnr["dealName"];
      this.deals.StartDate = moment(bnr["startDate"]).format('MM/DD/YYYY HH:mm').toString();

      this.deals.EndDate = moment(bnr["endDate"]).format('MM/DD/YYYY HH:mm').toString();
      this.deals.DealURL = bnr["dealURL"];
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
    if (this.dlang === "English") {
    }
    else if (this.dlang === "Arabic") {
    }
  }
  selectedoldLang() {
    if (this.doldlang === "English") {
      this.langbasedolditems = this.oldenglishbannerslist;
      this.setPage(1);

    }
    else if (this.doldlang === "Arabic") {
      this.langbasedolditems = this.oldarabicbannerslist;
      this.setPage(1);
    }
  }


  SaveAddorUpdate(header) {

    let countriescount: any[] = this.bannerForm.value["Countries"];

    if (this.deals.ArabicImage != "" || this.deals.EnglishImage != "") {


      if (this.deals.DealName != null) {
        if (!this.deals.DealName.match(this.namepattern)) {
          this.responsesty = "errormsg";
          this.response = "Please enter valid name.";
        }
        else {
          if (this.deals.StartDate != null && this.deals.EndDate != null) {
            if (this.deals.DealURL != "") {
              this.validatewebsiteurl();
            }
            else {
              if (this.deals.StartDate != "" && this.deals.EndDate != "") {
                this.responsesty = "";
                this.response = "";
                this.validatewebsiteurl();
                if (this.deals.StartDate != null && this.deals.EndDate != null) {
                  this.checkdates();
                }
              }
              else {
                this.responsesty = "errormsg";
                this.response = "Please select start & end dates.";
              }
            }
          }
          else {

            this.responsesty = "errormsg";
            this.response = "Please select start & end dates.";

          }
        }
      }
      else {
        this.responsesty = "errormsg";
        this.response = "Please enter name.";
      }


    }
    else {
      this.responsesty = "errormsg";
      this.response = "Please upload atleast one deal.";
    }

    if (this.bannerForm.valid) {
      if (this.response === "") {
        if (countriescount.length != 0) {

          if (this.header === "Add") {

            this.deals.Countries = "";
            let countriesids: [] = this.bannerForm.value["Countries"];

            countriesids.forEach(x => {
              this.deals.Countries = this.deals.Countries + x + ",";
            });
            this.deals.Countries = this.deals.Countries.replace(/,\s*$/, "")

            this.deals.EnglishImage = this.deals.EnglishImage.replace(/^data:image\/[a-z]+;base64,/, "");
            this.deals.ArabicImage = this.deals.ArabicImage.replace(/^data:image\/[a-z]+;base64,/, "");
            this.deals.MerchantEmail = this.localStorage.get("Email");
            let startdate = new Date(this.deals.StartDate).setMinutes(new Date(this.deals.StartDate).getMinutes() + 5);
            this.deals.StartDate = moment(this.deals.StartDate).format('YYYY/MM/DD HH:mm').toString();
            this.deals.EndDate = moment(this.deals.EndDate).format('YYYY/MM/DD HH:mm').toString();
            this.deals.countryTimezone="Arab Standard Time";
            this.delaservice.Adddeals(this.deals).subscribe(res => {
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
              this.ProgressSpinnerDlg = false;
              this.response = error["error"]["result"];
              this.responsesty = "errormsg";
            });
          }

          else if (this.header === "Update") {
            let EndDate = moment(this.deals.EndDate).format('YYYY/MM/DD HH:mm').toString();
            if (EndDate <= moment(new Date()).format('YYYY/MM/DD HH:mm').toString()) {
              this.responsesty = "errormsg";
              this.response = "End date is greater than the current date.";
            }
            else {
              this.responsesty = "";
              this.response = "";
              this.ProgressSpinnerDlg = true;

              this.updatedeals.ArabicImage = this.deals.ArabicImage.replace(/^data:image\/[a-z]+;base64,/, "");
              this.updatedeals.EnglishImage = this.deals.EnglishImage.replace(/^data:image\/[a-z]+;base64,/, "");
              this.updatedeals.DealDescription = this.deals.DealDescription;
              this.updatedeals.DealURL = this.deals.DealURL;
              this.updatedeals.StartDate = moment(this.deals.StartDate).format('YYYY/MM/DD HH:mm').toString();
              this.updatedeals.EndDate = moment(this.deals.EndDate).format('YYYY/MM/DD HH:mm').toString();
              this.updatedeals.DealName = this.deals.DealName;
              this.updatedeals.Countries = "";
              let countriesids: [] = this.bannerForm.value["Countries"];

              countriesids.forEach(x => {
                this.updatedeals.Countries = this.updatedeals.Countries + x + ",";
              });
              this.updatedeals.Countries = this.updatedeals.Countries.replace(/,\s*$/, "")
              this.updatedeals.countryTimezone="Arab Standard Time";
              this.delaservice.Updatedeals(this.updatedeals).subscribe(res => {
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
          this.response = "Please select atleast one country"
          this.responsesty = "errormsg";
        }
      }
    }
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.langbasedolditems.length, page, 3);
    this.pagedItems = this.langbasedolditems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    if (this.pagedItems.length > 0) {
      this.noolddeals = true;
    }
    else {
      this.noolddeals = false;
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
    this.deals.ArabicImage = reader.result;
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
    this.deals.EnglishImage = reader.result;
    this.ProgressSpinnerDlg = false;
  }

  ResetForm() {
    this.deals.ArabicImage = "";
    this.deals.DealDescription = "";
    this.deals.DealName = "";
    this.deals.EnglishImage = "";
    this.deals.StartDate = null;
    this.deals.EndDate = null;
    this.deals.DealURL = "";
    this.deals.Countries = this.countries[0].value;
  }


  GetActiveBanners() {
    this.MerchantDeals.Type = "A";
    this.MerchantDeals.MerchantEmail = this.localStorage.get("Email");
    this.MerchantDeals.countryTimezone=this.localStorage.get("Zone");
    //  let type = "O";
    this.delaservice.GetdealsList(this.MerchantDeals).subscribe(res => {
      this.Totalbanners = res;
      if (this.Totalbanners.length > 0) {
        this.nocurrentdeals = true;
      }
      else {
        this.nocurrentdeals = false;
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

    this.MerchantDeals.Type = "E";
    this.MerchantDeals.MerchantEmail = this.localStorage.get("Email");
    this.MerchantDeals.countryTimezone=this.localStorage.get("Zone");
    //let type = "A";
    this.delaservice.GetdealsList(this.MerchantDeals).subscribe(res => {
      this.oldbannerslist = res;
      if (this.oldbannerslist.length > 0) {
        this.noolddeals = true;
      }
      else {
        this.noolddeals = false;
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
    if (this.deals.DealURL != null) {
      if (this.deals.DealURL != "") {
       // if (!this.deals.DealURL.match(/^((https?|ftp|smtp):\/\/)?(www.)?[a-zA-Z0-9]+(\.[a-zA-Z]{2,}){1,3}(#?\/?[a-zA-Z0-9]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/)) {
        if (!this.deals.DealURL.match(this.webReg)) {  
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

      if (this.doldlang === "English") {
        this.langbasedolditems = this.oldenglishbannerslist;
        this.setPage(1);
      }
      else if (this.doldlang === "Arabic") {
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

      if (this.doldlang === "English") {
        this.langbasedolditems = this.oldenglishbannerslist;
        this.setPage(1);
      }
      else if (this.doldlang === "Arabic") {
        this.langbasedolditems = this.oldarabicbannerslist;
        this.setPage(1);
      }
    }

  }

  clear() {
    this.langbasedolditems.length = 0;
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

    if (this.doldlang === "English") {
      this.langbasedolditems = this.oldenglishbannerslist;
      this.setPage(1);
    }
    else if (this.doldlang === "Arabic") {
      this.langbasedolditems = this.oldarabicbannerslist;
      this.setPage(1);
    }
  }

  ConfirmDeletebanner() {
    this.btndisable = "disable";
    this.ProgressSpinnerDlg = true;
    this.deletedeal.DealId = this.updatedeals.DealId;
    this.deletedeal.countryTimezone="Arab Standard Time";
    this.delaservice.Deletedeal(this.deletedeal).subscribe(res => {

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

    if (new Date(this.deals.StartDate).getDate() === (new Date().getDate())) {
      if (new Date(this.deals.StartDate).getMinutes() === (new Date().getMinutes())) {
        this.minimumDate = new Date();
        this.minimumDate.setMinutes(new Date().getMinutes() + 5);
        this.deals.StartDate = moment(this.minimumDate).format('MM/DD/YYYY HH:mm').toString();
      }
    }
    else { 
    }

    if (this.deals.StartDate != null) {
      let StartDate = moment(this.deals.StartDate).format('YYYY/MM/DD HH:mm').toString();
      let CurntDate = moment(new Date()).format('YYYY/MM/DD HH:mm').toString();
      if (this.header === "Add") {
        if (StartDate <= CurntDate) {
          this.response = "Please select start date greater than the current date.";
          this.responsesty = "errormsg";
        }
        else if (this.deals.EndDate != null && this.deals.StartDate != null) {
          let EndDate = moment(this.deals.EndDate).format('YYYY/MM/DD HH:mm').toString();
          let StartDate = moment(this.deals.StartDate).format('YYYY/MM/DD HH:mm').toString();
  
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
        else
        {
          this.response = "";
          this.responsesty = "";
        }  
      }
      else if(this.header==="Update")
      {
        if(this.deletebtndisable.length==0)
        {
          if (StartDate <= CurntDate) {
            this.response = "Please select start date greater than the current date.";
            this.responsesty = "errormsg";
          }
          else if (this.deals.EndDate != null && this.deals.StartDate != null) {
            let EndDate = moment(this.deals.EndDate).format('YYYY/MM/DD HH:mm').toString();
            let StartDate = moment(this.deals.StartDate).format('YYYY/MM/DD HH:mm').toString();
    
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
          else
          {
            this.response = "";
            this.responsesty = "";
          }
        }
        else if(this.deletebtndisable.length>0)
        {
          if (this.deals.EndDate != null && this.deals.StartDate != null) {
            let EndDate = moment(this.deals.EndDate).format('YYYY/MM/DD HH:mm').toString();
            let StartDate = moment(this.deals.StartDate).format('YYYY/MM/DD HH:mm').toString();
    
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
          else
          {
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
