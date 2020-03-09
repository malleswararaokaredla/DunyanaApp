import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { ExcelService } from 'src/app/shared/services/excel.service';

import { DatePipe } from '@angular/common';
import { NaqelInternalTeamService } from '../../services/naqel-internal-team.service';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { Calendar } from 'primeng/calendar';
import { PrintDownloadOptions } from 'src/app/shared/dto/PrintDownloadOptionsDto';




@Component({
  selector: 'app-naqel-finance-team',
  templateUrl: './naqel-finance-team.component.html',
  styleUrls: ['./naqel-finance-team.component.scss']
})
export class NaqelFinanceTeamComponent implements OnInit {

  @ViewChild('dt') private _table: Table;
  @ViewChild('calendar') calendar: Calendar;
  private _Custtable: Table;

  ModalOptions: PrintDownloadOptions;
  naqelFinanceTeamdata: any[] = [];
  naqelfinanceteamdataCopy: any[] = [];
  withoutmodifieddata: any[] = [];
  lastindex = 0;
  rangeDates: any;
  cols: any[];
  walletTabCols: any[];
  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();
  ProgressSpinnerDlg: boolean = false;
  btndisable: "disable";
  orderNo: boolean = true;
  orderDate: boolean = true;
  orderStatus: boolean = true;
  merchantID: boolean = true;
  merchantName: boolean = true;
  customerFirstName: boolean = true;
  orderAmount: boolean = true;
  paidbyWallet:boolean=true;
  paidbycard:boolean=true;
  paidatMerchant:boolean=true;
  cod: boolean = true;
  btnExcel:boolean=false;
  naqelCustomers: any[] = [
    {
      'customerId': '1001',
      'customerName': 'ABDULLAH',
      'currencyType': 'SAR',
      'walletBal': '500',
    }
  ];

  @ViewChild('dt')
  private table: Table;
  test: string = "test";


  constructor(private excelService: ExcelService, private service: NaqelInternalTeamService) { }

  ngOnInit() {

    this.GetFinanceteamdata();
    this.cols = [
      { field: 'orderNo', header: 'Order ID' },
      { field: 'orderDate', header: 'Order Date' },
      { field: 'orderStatus', header: 'Order Status' },
      { field: 'merchantID', header: 'Merchant ID' },
      { field: 'merchantName', header: 'Merchant Name' },
      { field: 'customerFirstName', header: 'Customer Name' },
      { field: 'orderAmount', header: 'Amount(SAR)' },
      { field: 'paidbyWallet', header: 'Paid By Wallet' },
      { field: 'paidbycard', header: 'Paid By Card' },
      { field: 'paidatMerchant', header: 'Paid At Merchant' },

      { field: 'cod', header: 'COD Paid(Y/N)' }
    ];

    this.getCustomersData();
    this.walletTabCols = [
      { field: 'customerID', header: 'Customer ID' },
      { field: 'customerName', header: 'Customer Name' },
      { field: 'currency', header: 'Currency Type' },
      { field: 'walletBalance', header: 'Wallet Balance' },
    ];

    this.calendar.value = null;
    this.calendar.onClearClick;
  }

  getCustomersData() {
    this.service.GetCustomers().subscribe(res => {
      console.log('CUSTOMERS DATA ===>>> ', res);
      this.naqelCustomers = res;
    });
  }

  GetFinanceteamdata() {
this.ProgressSpinnerDlg=true;

    var datePipe = new DatePipe('en-US');
    this.service.GetNaqelfinanceteamList().subscribe(res => {
      this.naqelFinanceTeamdata = res;
      this.naqelfinanceteamdataCopy = res;
      this.withoutmodifieddata = res;
      if(this.naqelfinanceteamdataCopy.length==0){
       this.btnExcel=true;
      }
      else{
        this.btnExcel=false;
      }
      this.naqelFinanceTeamdata.forEach(row => {
        if (row["orderDate"]) {
          row["orderDate"] = moment(row["orderDate"]).format('MM-DD-YYYY');
        }
        if (row["cod"] === "Y") {
          row["cod"] = "Yes";
        }
        else if (row["cod"] === "N") {
          row["cod"] = "No";
        }
      });
      this.ProgressSpinnerDlg=false;

      this.lastindex = res.length;
      var emptyrows = 10 - (res.length % 10);
    });
  }
  SelectRange(): void {
    this.display = true;

  }

  filterDates(event: any) {
    if (this.rangeDates[0] !== null && this.rangeDates[1] !== null) {
      this.naqelfinanceteamdataCopy = [];
      let startDate = moment(this.rangeDates[0]).format('MM-DD-YYYY');
      let endDate = moment(this.rangeDates[1]).format('MM-DD-YYYY');
      this.naqelfinanceteamdataCopy = this.naqelFinanceTeamdata.filter((item: any) => {
        return moment(item.orderDate).isBetween(startDate, endDate, null, '[]');
      });

      if(this.naqelfinanceteamdataCopy.length==0){
        this.btnExcel=true;
      }
      else{
        this.btnExcel=false;
      }
    }


  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.naqelfinanceteamdataCopy, 'naqel-finance-team');
  }

  filterExcel(){
    
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

      if(this._table.filteredValue===null)
      {
        this.ModalOptions.tableData = this.naqelfinanceteamdataCopy;
      }
      else
      {
        this.ModalOptions.tableData = this._table.filteredValue;
      }
      
    }
    else {
      this.ModalOptions.tableData = this.naqelfinanceteamdataCopy;
    }
    
    if(this.ModalOptions.tableData.length==0){
      this.btnExcel=true;
    }
    else{
      this.btnExcel=false;
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
      this.ModalOptions.tableData = this.naqelfinanceteamdataCopy;
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

  onClose() {
    this.displayChange.emit(false);
  }

  clear() {
    this.GetFinanceteamdata();
  }
  showfilter(col) {

    if (col === "orderDate") {

      this.orderDate = !this.orderDate;
    } else if (col === "orderNo") {
      this.orderNo = !this.orderNo;
    } else if (col === "orderStatus") {

      this.orderStatus = !this.orderStatus;
    } else if (col === "merchantID") {

      this.merchantID = !this.merchantID;
    } else if (col === "merchantName") {

      this.merchantName = !this.merchantName;
    } else if (col === "customerFirstName") {

      this.customerFirstName = !this.customerFirstName;
    } else if (col === "orderAmount") {

      this.orderAmount = !this.orderAmount;
    }
    else if(col==="paidbyWallet")
    {
      this.paidbyWallet=!this.paidbyWallet;
    }   
    else if(col==="paidbycard")
    {
      this.paidbycard=!this.paidbycard;
    }
    else if(col==="paidatMerchant")
    {
      this.paidatMerchant=!this.paidatMerchant;
    }
    else if (col === "cod") {

      this.cod = !this.cod;
    }

  }
  onClick() {
    this.table.reset();
    this.orderDate = true;
    this.orderNo = true;
    this.orderStatus = true;
    this.merchantID = true;
    this.merchantName = true;
    this.customerFirstName = true;
    this.orderAmount = true;
    this.paidbyWallet=true;
    this.paidbycard=true;
    this.paidatMerchant=true;
    this.cod = true;
    this.btnExcel=false;
    if (this.rangeDates != null) {
      this.rangeDates = "";
      this.GetFinanceteamdata();
    }
  }

  exportCustToExcel() {
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
      columns: this.walletTabCols,
      reportHeaderColumns: '',
      reportFooterColumns: ''

    };

    this.ModalOptions.tableData = this.naqelCustomers;
    this.ModalOptions.fileName = 'Naqel Customers';

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

}
