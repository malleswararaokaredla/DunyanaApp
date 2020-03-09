import { Component, OnInit, ViewChild } from '@angular/core';
import { NaqelInternalTeamService } from '../../services/naqel-internal-team.service';
import { Table } from 'primeng/table';
import { PrintDownloadOptions } from 'src/app/shared/dto/PrintDownloadOptionsDto';
import { HttpClient } from '@angular/common/http'
import { testcs } from '../../model/testcs';


@Component({
  selector: 'app-naqel-contract-team',
  templateUrl: './naqel-contract-team.component.html',
  styleUrls: ['./naqel-contract-team.component.scss']
})
export class NaqelContractTeamComponent implements OnInit {

  @ViewChild('dt') private _table: Table;

  ModalOptions: PrintDownloadOptions;


  naqelcontractteamdata: any[] = [];

  archivefilesdisplay: boolean = false;
  cols: any[];
  contractID: boolean = true;
  excelDown: boolean = false;
  uploadconfirmdisplay: boolean = false;
  selectedmember: any = {};
  formData = new FormData();
  uploadconfirmresponse: string = "";
  responsesty: string = "";
  ProgressSpinnerupd: boolean = false;
  yesbtndisable: string = "";
  selectedarchfiles: any[] = [];

  merchantrequestID: boolean = true;
  merchantID: boolean = true;
  merchantName: boolean = true;
  contractstatus: boolean = true;

  public progress: number;
  public message: string;

  files: Array<any> = new Array<any>();

  test: testcs = {
    id: 0,
  }

  constructor(private service: NaqelInternalTeamService, private http: HttpClient) { }

  ngOnInit() {

    this.GetContractteamdetails();

    this.cols = [
      { field: 'merchantrequestID', header: 'Request ID' },
      { field: 'merchantID', header: 'Merchant ID' },
      { field: 'merchantName', header: 'Merchant Name' },
      { field: 'contractUploaddate', header: 'Upload Status/Timestamp' },
    ];
  }

  GetContractteamdetails() {
    this.ProgressSpinnerupd = true;
    this.service.GetNaqelcontractteamList().subscribe(res => {
      this.ProgressSpinnerupd = false;
      this.naqelcontractteamdata = res;

      if (this.naqelcontractteamdata.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    });
  }

  showfilter(col) {
    if (col === "merchantrequestID") {

      this.merchantrequestID = !this.merchantrequestID;
    } else if (col === "merchantID") {

      this.merchantID = !this.merchantID;
    } else if (col === "merchantName") {

      this.merchantName = !this.merchantName;
    } else if (col === "contractstatus") {

      this.contractstatus = !this.contractstatus;
    }

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

      if (this._table.filteredValue === null) {
        this.ModalOptions.tableData = this.naqelcontractteamdata;
      }
      else {
        this.ModalOptions.tableData = this._table.filteredValue;
      }

    }
    else {
      this.ModalOptions.tableData = this.naqelcontractteamdata;
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
      this.ModalOptions.tableData = this._table.filteredValue;
    }
    else {
      this.ModalOptions.tableData = this.naqelcontractteamdata;
    }
    this.ModalOptions.fileName = 'Naqel Finance';

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
    this._table.reset();
    this.merchantName = true;
    this.contractID = true;
    this.excelDown = false;

  }

  fileChange(event, member) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      let headers = new Headers();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
    }
  }
  Openarchivefiles(merchantcontractsHistory) {
    this.selectedarchfiles = merchantcontractsHistory;
    this.archivefilesdisplay = true;
  }



  upload(files, member) {
    this.selectedmember = member;

    this.uploadconfirmdisplay = true;
    if (files.length === 0)
      return;

    this.formData = new FormData();
    for (let file of files)
      this.formData.append(file.name, file);
    this.formData.append("MerchantID", member["merchantID"]);
    this.formData.append("MerchantrequestID", member["merchantrequestID"]);
  }


  Confirmupload() {
    this.yesbtndisable = "disable";
    this.ProgressSpinnerupd = true;
    this.service.Uploadfile(this.formData).subscribe(res => {
      this.ProgressSpinnerupd = false;
      this.uploadconfirmresponse = res["result"];
      this.responsesty = "succsmsg";
      this.GetContractteamdetails();
      setTimeout(() => {
        this.yesbtndisable = "";
        this.uploadconfirmresponse = "";
        this.uploadconfirmdisplay = false;
      }, 2000);
    },
      error => {
        this.yesbtndisable = "";
        this.ProgressSpinnerupd = false;
        this.uploadconfirmresponse = error["error"]["result"];
        this.responsesty = "errormsg";
      });
  }

  Closeupload() {
    this.uploadconfirmdisplay = false;
    this.uploadconfirmresponse = "";

  }
  onuploadconfirmClose() {
    this.uploadconfirmdisplay = false;
    this.uploadconfirmresponse = "";
  }
}
