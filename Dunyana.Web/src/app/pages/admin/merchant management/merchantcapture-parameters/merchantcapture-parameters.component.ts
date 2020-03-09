import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MerchantRedirectionDto } from 'src/app/pages/merchant/modal/MerchantRedirectionDto';
import { MerchantUrlDto } from 'src/app/pages/merchant/modal/MerchantUrlDto';
import { MerchantService } from 'src/app/pages/merchant/services/merchant.service';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { PrintDownloadOptions } from 'src/app/shared/dto/PrintDownloadOptionsDto';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-merchantcapture-parameters',
  templateUrl: './merchantcapture-parameters.component.html',
  styleUrls: ['./merchantcapture-parameters.component.scss']
})
export class MerchantcaptureParametersComponent implements OnInit {

  @ViewChild('dt') private _table: Table;
  ModalOptions: PrintDownloadOptions;

  merchentForm: FormGroup;
  merchanturl: string;
  merchentid: number;
  merchantemail: string;
  arrayobj: any[] = [];
  merchenturl: string;
  excelDown: boolean = false;

  @Output() displayChange = new EventEmitter();
  merchentlist: any[] = [];
  merchentfilterlist: any[] = [];
  selectedmerchent: any;
  cols: any[] = [];
  editmerchentdisplay: boolean = false;
  usersForm: FormGroup;
  display: boolean = false;

  btndisable: string = "disable";
  btnsdisable: string;
  btnAddDisable: boolean = false;

  headerlogo: string = "assets/layout/images/glogo.png";
  responsesty: string = "";
  webReg: string = '(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?';
  namePattern: string = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';
  txtErrormsg: boolean = true;
  websitevalidmsg: string = "";
  response: string;

  btnsubmit: boolean = false;
  submitted = false;
  btnform: boolean = true;
  ProgressSpinnerDlg: boolean = false;
  ProgressSpinnerupd: boolean = false;
  @ViewChild('div') div: ElementRef;
  @ViewChild('msgdiv') msgdiv: ElementRef;

  formvaliderrormsg: string = "";

  merchents: any[] = [];
  _MerchantRedirectionDto: MerchantRedirectionDto = {
    merchantRedirectionId: 0,
    MerchantAttribute: null,
    MerchantValue: null,
    MerchantDescription: null
  }

  onClose() {
    this.displayChange.emit(false);
  }
  redirectcustomerlist() {

    this.editmerchentdisplay = false;
    this.bindmerchentdata();
  }

  _MerchantUrlDto: MerchantUrlDto = {
    merchantid: 0,
    merchantRedirectionUrl: null

  }

  website: string;

  Email: string;
  merchantParmlist: any[] = [];

  merchantservicedata: any = {};

  merchantAttribute: boolean = true;
  merchantValue: boolean = true;
  merchantDescription: boolean = true;

  constructor(private fb: FormBuilder, private merchantservice: MerchantService,
    private localStorage: LocalStorageService, private messageService: MessageService,
    private router: Router, private excelService: ExcelService) {

  }



  ngOnInit() {

    this.bindmerchants();
    this.merchentid = parseInt(localStorage.getItem('id'));

    this.merchentForm = this.fb.group({
      MerchantAttribute: ['', Validators.required],
      MerchantValue: ['', Validators.required],
      MerchantDescription: ['', Validators.required],
      merchantRedirectionId: []
    });


    this.cols = [

      { field: 'merchantAttribute', header: 'Attribute' },
      { field: 'merchantValue', header: 'Value' },
      { field: 'merchantDescription', header: 'Description' },

    ];
  }


  Addmerchents() {
    this.display = true;
    this.excelDown = false;
  }

  onDialogClose(event) {
    this.display = event;
    this.bindmerchentdata();
  }

  Resetform() {
    this.merchentForm.reset({
      MerchantAttribute: '',
      MerchantValue: '',
      MerchantDescription: '',
      Merchanturl: ''
    })
  }


  HideResponse() {
    setTimeout(() => {
      this.div.nativeElement.innerHTML = "";
    }, 5000);
  }

  hidemsgdiv() {
    setTimeout(() => {
      this.msgdiv.nativeElement.innerHTML = "";
    }, 5000);
  }

  validurl(url: string) {
    this.merchanturl = url;
    if (this.merchanturl != null) {
      if (this.merchanturl.length > 0) {
        if (this.merchanturl.match(/^((https?|ftp|smtp):\/\/)?(www.)?[a-zA-Z0-9]+(\.[a-zA-Z]{2,}){1,3}(#?\/?[a-zA-Z0-9]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/)) {
          this.btnsdisable = "line_btn sblue mr-4";
          this.txtErrormsg = true;
          this.websitevalidmsg = "";
        } else {
          this.btnsdisable = "disable";
          this.txtErrormsg = false;
          this.websitevalidmsg = "Please enter valid merchant redirect URL";
        }
      } else {
        this.btnsdisable = "disable";
        this.txtErrormsg = false;
        this.websitevalidmsg = "Please enter merchant redirect URL";
      }
    } else {
      this.btnsdisable = "disable";
      this.txtErrormsg = false;
      this.websitevalidmsg = "Please enter merchant redirect URL";
    }

  }

  submiturl(url: string) {
    this.merchanturl = url;
    this.merchentid = this.arrayobj[0];
    this.txtErrormsg = true;
    this.websitevalidmsg = "";
    this._MerchantUrlDto.merchantid = this.merchentid;
    this._MerchantUrlDto.merchantRedirectionUrl = this.merchanturl;
    this.ProgressSpinnerDlg = true;
    this.merchantservice.merhenturlupdation(this._MerchantUrlDto).subscribe(res => {
      this.ProgressSpinnerDlg = false;
      this.btnAddDisable = false;
      this.responsesty = "succsmsg";
      this.bindmerchants();
      this.div.nativeElement.innerHTML = res["result"];
      this.HideResponse();
    },
      error => {

        this.ProgressSpinnerDlg = false;
        this.responsesty = "errormsg";
        this.div.nativeElement.innerHTML = error["result"];
        this.merchanturl = this.arrayobj[1];
        this.HideResponse();
      });
  }


  bindmerchants() {
    this.merchents.length = 0;
    this.merchents.push({ label: 'Select Merchant', value: 0 });
    this.merchantservice.Getmerchantdata().subscribe(res => {
      Object.keys(res).map(key => (
        this.merchents.push({ label: res[key]["name"], value: res[key]["merchantid"] + ',' + res[key]["merchantRedirectionUrl"] })
      ));
    });
  }

  formvalidate() {
    if (this.merchentForm.valid) {
      this.btndisable = "line_btn sblue mr-4";
    }
    else {
      this.btndisable = "disable";
    }
  }

  Merchantdata(x) {

    if (x.value != 0) {
      this.btnform = false;
      this.txtErrormsg = true;
      let s = x.value.split(',');
      this.arrayobj = s;
      if (this.arrayobj[1] == "null" || this.arrayobj[1] == "") {
        this.arrayobj[1] = "";
        this.btnsdisable = "disable";
        this.btnAddDisable = true;
      }
      else {
        this.btnsdisable = "line_btn sblue mr-4";
        this.btnAddDisable = false;
      }
      this.merchentid = this.arrayobj[0];

      this.ProgressSpinnerDlg = true;
      this.localStorage.set("merchantparmid", this.merchentid);

      this.merchantservice.Getmerchantdetials(this.merchentid).subscribe(res => {
        this.ProgressSpinnerDlg = false;
        this.btnform = false;
        this.merchanturl = res['merchantRedirectionUrl'];
        this.localStorage.set('redirecturl', res['merchantRedirectionUrl']);
        this.merchentlist = res['merchantRedirectionlist'];
        if (this.merchentlist.length == 0) {
          this.excelDown = true;
        }
        else {
          this.excelDown = false;
        }

      });
    }
    else {
      this.btnform = true;
      this.merchentlist = [];
      this.merchanturl = "";
      this.btnsdisable = "disable";
    }
  }

  bindmerchentdata() {

    this.merchantservice.Getmerchantdetials(this.merchentid).subscribe(res => {
      this.btnform = false;
      this.merchentlist = res['merchantRedirectionlist'];
      if (this.merchentlist.length == 0) {
        this.excelDown = true;
      }
    });
  }

  exportAsXLSX(): void {

    if (this.merchentlist.length != 0) {
      this.merchentfilterlist = this.merchentlist.map(function (obj) {
        return {
          MerchantAttribute: obj.merchantAttribute,
          MerchantDescription: obj.merchantDescription,
          MerchantValue: obj.merchantValue
        }
      });
      this.excelService.exportAsExcelFile(this.merchentfilterlist, 'Merchent Data');
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

    if (this._table.hasFilter()) {
      this.ModalOptions.tableData = this._table.filteredValue;
    }
    else {
      this.ModalOptions.tableData = this.merchentlist;
    }

    if (this.ModalOptions.tableData.length == 0) {
      this.excelDown = true;
    }
    else {
      this.excelDown = false;
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
    if (this._table.hasFilter()) {

      if (this._table.filteredValue === null) {
        this.ModalOptions.tableData = this.merchentlist;
      }
      else {
        this.ModalOptions.tableData = this._table.filteredValue;
      }
    }
    else {
      this.ModalOptions.tableData = this.merchentlist;
    }

    this.ModalOptions.fileName = 'Merchant capture parameters';

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
    document.body.appendChild(link);
    link.click();
  }

  onRowSelect(event) {
    this.merchentForm.controls['merchantRedirectionId'].setValue(event.data["merchantRedirectionId"]);
    this.merchentForm.controls['MerchantAttribute'].setValue(event.data["merchantAttribute"]);
    this.merchentForm.controls['MerchantValue'].setValue(event.data["merchantValue"]);
    this.merchentForm.controls['MerchantDescription'].setValue(event.data["merchantDescription"]);
    this.btndisable = "line_btn sblue mr-4";
    this.editmerchentdisplay = true;
  }


  updatemerchentvalues() {

    this._MerchantRedirectionDto.merchantRedirectionId = this.merchentForm.value['merchantRedirectionId'];
    this._MerchantRedirectionDto.MerchantAttribute = this.merchentForm.value["MerchantAttribute"];
    this._MerchantRedirectionDto.MerchantDescription = this.merchentForm.value["MerchantDescription"];
    this._MerchantRedirectionDto.MerchantValue = this.merchentForm.value["MerchantValue"];

    this.merchentlist.push(this._MerchantRedirectionDto);

    this.ProgressSpinnerupd = true;
    this.merchantservice.updatemerchenturlparams(this._MerchantRedirectionDto, this.merchentid).subscribe(res => {
      this.ProgressSpinnerupd = false;
      this.btndisable = "disable";
      this.responsesty = "succsmsg";
      this.msgdiv.nativeElement.innerHTML = res["result"];
      this.hidemsgdiv();

      setTimeout(() => {
        this.btndisable = "";
        this.redirectcustomerlist();
      }, 2000);

      this.Resetform();
    },
      error => {
        this.ProgressSpinnerupd = false;
        this.responsesty = "errormsg";
        this.msgdiv.nativeElement.innerHTML = error["error"]["result"];
        this.hidemsgdiv();
      });
  }



  showfilter(col) {

    if (col === "merchantAttribute") {

      this.merchantAttribute = !this.merchantAttribute;
    } else if (col === "merchantValue") {

      this.merchantValue = !this.merchantValue;
    } else if (col === "merchantDescription") {

      this.merchantDescription = !this.merchantDescription;
    }
  }

  onClick() {
    this._table.reset();
    this.merchantAttribute = true;
    this.merchantValue = true;
    this.merchantDescription = true;
    this.excelDown = false;
  }

}
