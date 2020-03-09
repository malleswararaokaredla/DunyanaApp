import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { LegalTeam } from '../../model/naqel-legal-team';
import { NaqelInternalTeamService } from '../../services/naqel-internal-team.service';
import { LocalStorageService } from 'angular-web-storage';
import { legalDto } from 'src/app/pages/naqel-internal/model/legal-teamdto';
import { Table } from 'primeng/table';
import { PrintDownloadOptions } from 'src/app/shared/dto/PrintDownloadOptionsDto';
import * as moment from 'moment';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'app-naqel-legal-team',
  templateUrl: './naqel-legal-team.component.html',
  styleUrls: ['./naqel-legal-team.component.scss']
})
export class NaqelLegalTeamComponent implements OnInit {

  @ViewChild('dtt') private _opnreqtable: Table;
  @ViewChild('dtinp') private _myreqtable: Table;
  @ViewChild('calendar') calendar: Calendar;

  ModalOptions: PrintDownloadOptions;

  editdisplay: boolean = false;
  excelDown: boolean = false;

  @Output() displayChange = new EventEmitter();

  naqelopenleagaldata: any[];
  naqelopenfilterdcopydata: any[] = [];

  naqelinprogressleagaldata: any[];
  naqelinprogressleagaldata1: any[];
  naqelapprovedleagaldata: any[];
  naqelrejectedleagaldata: any[];
  naqelonholdleagaldata: any[];
  selectedopenmerchant: any;
  selectedinprocessmerchant: any;
  response: string = "";
  responsesty: string = "";
  errmsg: string = "";
  btndisable: string = "";
  ProgressSpinnerDlg: boolean = false;
  ProgressSpinnereditDlg: boolean = false;

  movedtoinprocess: boolean = true;
  Naqelteamsdata: any[] = [];
  cols: any[];
  assigncols: any[];
  index: number = 0;

  isrowselect: boolean = true;
  isinprocessrowselect: boolean = true;

  selectedopenrow: any;
  merchantname: string = "";
  namePattern: string = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';
  createdon: any = null;
  legalteam: LegalTeam = {
    RequestId: 0,
    MerchantID: 0,
    MerchantName: null,
    ApprovalStatus: 0,
    ApprovalStatusdesc: null,
    RequestAssignee: 0,
    Description: "",
    merchantContractNumber:null
  }

  legaldto: legalDto =
    {
      RequestType: null,
      NaqelUserEmail: null,
      NaqelUserType: null
    }

  Status: any[] = [];
  Approvedstatus: any[] = [];
  isapprovedtype:boolean=true;

  merchantName: boolean = true;
  sourceLocation: boolean = true;
  operatingCountries: boolean = true;
  categories: boolean = true;
  requestCreatedOn: boolean = true;

  lmerchantName: boolean = true;
  lmerchantContractNumber:boolean=true;
  lsourceLocation: boolean = true;
  loperatingCountries: boolean = true;
  lcategories: boolean = true;
  requestStatus: boolean = true;
  requestAssigneeName: boolean = true;

  constructor(private dataservice: NaqelInternalTeamService, private localStorage: LocalStorageService) { }

  ngOnInit() {

    this.GetNaqelLegalTeamData();
    this.Getlegalstatus();


    this.cols = [
      { field: 'merchantName', header: 'Merchant Name' },
      { field: 'sourceLocation', header: 'Source Location' },
      { field: 'operatingCountries', header: 'Operating Countries' },
      { field: 'categories', header: 'Categories' },
      { field: 'requestCreatedOn', header: 'Created On' }
    ];
    this.assigncols = [
      { field: 'merchantName', header: 'Merchant Name' },
      { field: 'sourceLocation', header: 'Source Location' },
      { field: 'operatingCountries', header: 'Operating Countries' },
      { field: 'categories', header: 'Categories' },
      { field: 'requestStatus', header: 'Status' },
      { field: 'requestAssigneeName', header: 'Assigner Name' },
      { field: 'merchantContractNumber', header: 'Merchant Contract Number' },

    ];

  }


  GetNaqelLegalTeamData() {
    this.ProgressSpinnerDlg = true;
    this.legaldto.NaqelUserEmail = this.localStorage.get("Email");
    this.legaldto.NaqelUserType = this.localStorage.get("loginType");
    this.legaldto.RequestType = "O"
    this.dataservice.GetNaqellegalteamList(this.legaldto).subscribe(res => {
      this.Naqelteamsdata = res;
      this.ProgressSpinnerDlg = false;
      this.naqelopenleagaldata = this.Naqelteamsdata;
      this.naqelopenfilterdcopydata = this.naqelopenleagaldata
      if (this.naqelopenfilterdcopydata.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }

      this.naqelopenfilterdcopydata.forEach(row => {
        if (row["requestCreatedOn"]) {
          row["requestCreatedOn"] = moment(row["requestCreatedOn"]).format('MM-DD-YYYY');

        }
      });

      if (this.createdon != null) {
        this.filterDates();

      }

    });
  }

  GetLegalTeamInprocessData() {
    this.ProgressSpinnerDlg = true;
    this.legaldto.NaqelUserEmail = this.localStorage.get("Email");
    this.legaldto.NaqelUserType = this.localStorage.get("loginType");
    this.legaldto.RequestType = "NO"
    this.dataservice.GetNaqellegalteamList(this.legaldto).subscribe(res => {
      this.Naqelteamsdata = res;
      this.ProgressSpinnerDlg = false;
      this.naqelinprogressleagaldata = this.Naqelteamsdata;
      if (this.naqelinprogressleagaldata.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    });
  }



  Getlegalstatus() {
    this.dataservice.GetNaqellegalstatus().subscribe(res => {
      this.Status = res;
      this.Approvedstatus = res;
    });
  }

  UpdatelegalteamStatus(legalteam) {


    this.legalteam.Description = this.legalteam.Description.trim();
    this.ProgressSpinnereditDlg = true;

    this.dataservice.UpdateNaqellegalstatus(legalteam).subscribe(res => {

      this.ProgressSpinnereditDlg = false;
      this.response = "Status updated successfully";

      this.responsesty = "succsmsg";
      this.GetLegalTeamInprocessData();
      this.GetNaqelLegalTeamData();

      setTimeout(() => {
        this.btndisable = "";
        this.displayChange.emit(false);
        this.response = "";
        this.closeupdatedialog();
      }, 2000);
    },
      error => {
        this.ProgressSpinnereditDlg = false;
        this.btndisable = "";
        this.response = "Status not updated successfully please try again";
        this.responsesty = "errormsg";
        setTimeout(() => {
          this.response = "";

        }, 2000);
      });
  }


  onRowSelect(event) {

    this.isrowselect = false;

  }
  onopenRowUnselect(event) {
    this.isrowselect = true;
  }
  movetoInprocess() {
    let index = this.naqelopenfilterdcopydata.indexOf(this.selectedopenmerchant);
    this.naqelopenfilterdcopydata = this.naqelopenfilterdcopydata.filter((val, i) => i != index);
    this.isrowselect = true;

    this.legalteam.RequestId = this.selectedopenmerchant.requestID;
    this.legalteam.MerchantID = this.selectedopenmerchant.merchantID;
    this.legalteam.MerchantName = this.selectedopenmerchant.merchantName;
    this.legalteam.ApprovalStatusdesc = this.selectedopenmerchant.requestStatus;
    this.legalteam.Description = "";
    this.legalteam.RequestAssignee = this.localStorage.get("naqelid");

    let statusid = this.Approvedstatus.filter(x => {
      if (x.description === "In Process") {
        return x;
      }
    });

    this.legalteam.ApprovalStatus = statusid[0]["id"];
    this.movedtoinprocess = false;
    setTimeout(() => {
      this.movedtoinprocess = true;
    }, 3000);

    this.UpdatelegalteamStatus(this.legalteam);
    this.GetLegalTeamInprocessData();

  }

  oninprocessRowSelect(event) {
    this.errmsg = "";
    this.isinprocessrowselect = false;
    this.editdisplay = true;
    this.merchantname = event.data["merchantName"];

    if (event.data["requestStatus"] === "Approved") {
      let statusdata = [];
      statusdata = this.Approvedstatus.filter(x => {
        if (x["description"] != "Open") {
          if (x["description"] != "In Process") {
            this.isapprovedtype=false;
            return x;
          }

        }
      });
      this.Status = statusdata;
    }
    else if (event.data["requestStatus"] === "Rejected") {
      let statusdata = [];
      statusdata = this.Approvedstatus.filter(x => {
        if (x["description"] != "Open") {
          if (x["description"] != "In Process") {
            this.isapprovedtype=true;
            return x;
          }

        }
      });
      this.Status = statusdata;
    }

    else if (event.data["requestStatus"] === "On Hold") {
      let statusdata = [];
      statusdata = this.Approvedstatus.filter(x => {
        if (x["description"] != "Open") {
          if (x["description"] != "In Process") {
            this.isapprovedtype=true;
            return x;
          }

        }
      });
      this.Status = statusdata;
    }

    else {
      this.Status = this.Approvedstatus;
    }

    this.Status.forEach(x => {
      if (x["description"] === event.data["requestStatus"]) {
        this.legalteam.ApprovalStatusdesc = x["description"];
        this.legalteam.ApprovalStatus = x["id"];
      }
    });
    this.legalteam.MerchantName = this.merchantname;
    this.legalteam.Description = event.data["requestDescription"];
    this.legalteam.RequestAssignee = this.localStorage.get("naqelid");
    this.legalteam.RequestId = event.data["requestID"];
    this.legalteam.MerchantID = event.data["merchantID"];
    this.legalteam.merchantContractNumber=event.data["merchantContractNumber"];
  }

  oninprocessRowUnselect(event) {
    this.isinprocessrowselect = true;
  }


  onDialogClose(event) {
    this.editdisplay = event;
    this.isapprovedtype=true;
  }
  closeupdatedialog() {
    this.editdisplay = false;
    this.isapprovedtype=true;
  }
  onClose() {
    this.isapprovedtype=true;

    this.displayChange.emit(false);
  }
  Updatelegalstatus() {

    if (this.legalteam.Description.length == 0) {

      this.response = "Please enter description.";
      this.responsesty = "errormsg";
    }

    else if(this.legalteam.merchantContractNumber.length != 0) {

      this.errmsg = "";
      this.btndisable = "disable";
      this.UpdatelegalteamStatus(this.legalteam);

    }
    else
    {
      this.response = "Please enter Contract Number";
      this.responsesty = "errormsg";
    }
  }
  redirectCustomer() {
    this.displayChange.emit(false);
  }

  getstatusdesc() {
    this.Status.forEach(x => {
      if (parseInt(x["id"]) == this.legalteam.ApprovalStatus) {
        this.legalteam.ApprovalStatusdesc = x["description"];
             if(this.legalteam.ApprovalStatusdesc==="Approved")
             {
               this.isapprovedtype=false;
             }
             else
             {
              this.isapprovedtype=true;
             }
      }
    });
  }

  showfilter(col) {

    if (col === "merchantName") {

      this.merchantName = !this.merchantName;
    } else if (col === "sourceLocation") {

      this.sourceLocation = !this.sourceLocation;
    } else if (col === "operatingCountries") {

      this.operatingCountries = !this.operatingCountries;
    } else if (col === "categories") {

      this.categories = !this.categories;
    }
    else if (col === "requestCreatedOn") {

      this.requestCreatedOn = !this.requestCreatedOn;
    }
  }

  showlegalfilter(col) {

    if (col === "merchantName") {

      this.lmerchantName = !this.lmerchantName;
    }
    else if(col=="merchantContractNumber")
    {
      this.lmerchantContractNumber=!this.lmerchantContractNumber;
    }
    else if (col === "sourceLocation") {
      this.lsourceLocation = !this.lsourceLocation;
    } else if (col === "operatingCountries") {

      this.loperatingCountries = !this.loperatingCountries;
    } else if (col === "categories") {

      this.lcategories = !this.lcategories;
    }
    else if (col === "requestStatus") {

      this.requestStatus = !this.requestStatus;
    }
    else if (col === "requestAssigneeName") {

      this.requestAssigneeName = !this.requestAssigneeName;
    }
  }

  changeTab(e) {
    this.index = e.index;

    this.ModalOptions = {
      key: '',
      fileName: '',
      dialogHeader: '',
      dialogMessage: '',
      enableDownloadExcel: true,
      enablePrint: true,
      dataSource: '',
      tableData: '',
      columns: this.cols,
      reportHeaderColumns: '',
      reportFooterColumns: ''

    };
    if (this.index == 0) {
      if (this._opnreqtable.hasFilter()) {
        this.ModalOptions.tableData = this._opnreqtable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.naqelopenfilterdcopydata;
      }

      if (this.ModalOptions.tableData.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    }

    else if (this.index == 1) {
      this.GetLegalTeamInprocessData();
      if (this._myreqtable.hasFilter()) {
        this.ModalOptions.tableData = this._myreqtable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.naqelinprogressleagaldata;
      }
      if (this.ModalOptions.tableData.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }

    }
  }

  filterExcel() {

    this.ModalOptions = {
      key: '',
      fileName: '',
      dialogHeader: '',
      dialogMessage: '',
      enableDownloadExcel: true,
      enablePrint: true,
      dataSource: '',
      tableData: '',
      columns: this.cols,
      reportHeaderColumns: '',
      reportFooterColumns: ''

    };
    if (this.index == 0) {
      if (this._opnreqtable.hasFilter()) {
        this.ModalOptions.tableData = this._opnreqtable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.naqelopenfilterdcopydata;
      }

      if (this.ModalOptions.tableData.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    }

    else if (this.index == 1) {
      if (this._myreqtable.hasFilter()) {
        this.ModalOptions.tableData = this._myreqtable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.naqelinprogressleagaldata;
      }
      if (this.ModalOptions.tableData.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }

    }

  }

  exportToExcel() {

    const rowsString: string[] = [];
    let headerString = '';
    let csv = '';

    this.ModalOptions = {
      key: '',
      fileName: '',
      dialogHeader: '',
      dialogMessage: '',
      enableDownloadExcel: true,
      enablePrint: true,
      dataSource: '',
      tableData: '',
      columns: this.cols,
      reportHeaderColumns: '',
      reportFooterColumns: ''

    };

    if (this.index == 0) {

      if (this._opnreqtable.hasFilter()) {

        if (this._opnreqtable.filteredValue === null) {
          this.ModalOptions.tableData = this.naqelopenfilterdcopydata;
        }
        else {
          this.ModalOptions.tableData = this._opnreqtable.filteredValue;
        }

      }
      else {
        this.ModalOptions.tableData = this.naqelopenfilterdcopydata;
      }
      this.ModalOptions.fileName = 'Naqel Legal Open Request';
    }
    else if (this.index == 1) {
      if (this._myreqtable.hasFilter()) {

        if (this._myreqtable.filteredValue === null) {
          this.ModalOptions.tableData = this.naqelinprogressleagaldata;
        }
        else {
          this.ModalOptions.tableData = this._myreqtable.filteredValue;
        }

      }
      else {
        this.ModalOptions.tableData = this.naqelinprogressleagaldata;
      }
      this.ModalOptions.fileName = 'Naqel Legal My Request';
    }


    for (const column of this.ModalOptions.columns) {
      let data = column.header;
      data = data === 'undefined' ? '' : data;
      data = data === null ? '' : data;
      data = data === 'null' ? '' : data;
      headerString += data + ',';

    }
    csv += headerString + '\n';

    for (let i = 0; i < this.ModalOptions.tableData.length; i++) {
      let rowString = '';
      let colNames = '';
      let objValues = {};
      let val = '';

      const tableRow = this.ModalOptions.tableData[i];
      for (const column of this.ModalOptions.columns) {
        if (column.field.includes('.')) {
          colNames = column.field.split('.');
          objValues = tableRow[colNames[0]];
          val = String(objValues[colNames[1]])
            .replace(/[\n\r]+/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/,/g, '')
            .trim();
          val = val === 'true' ? '1' : val === 'false' ? '0' : val;
          val = val === null ? '' : val;
          val = val === 'null' ? '' : val;
          val = val === '0' ? '' : val;
          val = val === 'undefined' ? '' : val;
          rowString += val + ',';
        } else {
          val = String(tableRow[column.field])
            .replace(/[\n\r]+/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/,/g, '')
            .trim();
          val = val === 'true' ? '1' : val === 'false' ? '0' : val;
          val = val === null ? '' : val;
          val = val === 'null' ? '' : val;
          val = val === '0' ? '' : val;
          val = val === 'undefined' ? '' : val;
          rowString += val + ',';
        }
      }
      rowsString.push(rowString);
    }

    for (const row of rowsString) {
      csv += row + '\n';
    }

    csv += this.ModalOptions.reportFooterColumns + '\n';
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.setAttribute('href', window.URL.createObjectURL(blob));
    link.setAttribute(
      'download',
      this.ModalOptions.fileName + this.ModalOptions.key + '.csv'
    );
    document.body.appendChild(link); // Required for FF
    link.click();
  }

  onClick() {
    if (this.index === 0) {
      this._opnreqtable.reset();
      this.merchantName = true;
      this.sourceLocation = true;
      this.operatingCountries = true;
      this.categories = true;
      this.requestCreatedOn = true;
      this.excelDown = false;
      this.createdon = null;
      this.clear();
    }
    else if (this.index === 1) {
      this._myreqtable.reset();
      this.lmerchantName = true;
      this.lmerchantContractNumber=true;
      this.lsourceLocation = true;
      this.loperatingCountries = true;
      this.lcategories = true;
      this.requestStatus = true;
      this.requestAssigneeName = true;
      this.excelDown = false;
    }
  }

  filterDates() {
    let selectedate = moment(this.createdon).format('MM-DD-YYYY');
    let filteredata = [];
    filteredata.length = 0;
    filteredata = this.naqelopenleagaldata.filter(x => {
      if (x["requestCreatedOn"] === selectedate) {
        return x;
      }
    });
    this.naqelopenfilterdcopydata = filteredata;

  }
  clear() {
    this.naqelopenfilterdcopydata = this.naqelopenleagaldata;
  }

  _keyPress(event: any) {
    const pattern = /^([0-9]+ )+[0-9]+$|^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
