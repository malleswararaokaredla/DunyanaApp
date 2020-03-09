import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MerchantService } from 'src/app/pages/merchant/services/merchant.service';
import * as XLSX from 'xlsx';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { PrintDownloadOptions } from 'src/app/shared/dto/PrintDownloadOptionsDto';
import { Table } from 'primeng/table';
import * as moment from 'moment';
import { MerchantCatalogService } from '../../services/merchant_catalog.service';
import { LocalStorageService } from 'angular-web-storage';
import { UpdateMerchantCatalogDto } from '../../model/UpdateMerchantCatalogDto';
import { InsetMerchantCatalogDto } from '../../model/InsetMerchantCatalogDto';
import { DeleteMerchantCatalogDto } from '../../model/DeleteMerchantCatalogDto';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent implements OnInit {

  @Output() displayChange = new EventEmitter();
  @ViewChild('dt') private _table: Table;
  @ViewChild('dt')
  private table: Table;
  parentMessage: any[] = [];
  modelheader: string;
  merchantCatlogForm: FormGroup;
  merchants: any[] = [];
  merchantswith_categories: any[] = [];

  merchant_catalog_data: any[] = [];
  merchant_catlog_list: any[] = [];
  merchant_catalog_template: any[] = [];
  cols: any[] = [];
  headers: any[] = [];
  arrayBuffer: any;
  file: File;
  worksheetdata: any[] = [];
  btnform: boolean = true;
  display: boolean = false;
  editmerchentdisplay: boolean = false;
  excelDown: boolean = false;
  btndisable: string = "disable";
  uploadbtndisable: string = "disable";
  yesbtndisable: string = "disable";
  categories: any[] = [];
  displayUpload: boolean = false;
  deletedisplay: boolean = false;
  selectedmerchent: any;
  ProgressSpinnerupd: boolean = false;
  responsesty: string = "";
  response: string = "";
  deleteresponse: string = "";
  exceluploadresponse: string = "";
  secondbtn: string;
  namepattern: string = '^([A-Za-z0-9-_!@#$%^&*(),.?":{}]+ )+[A-Za-z0-9-_!@#$%^&*(),.?":{}]+$|^[A-Za-z0-9-_!@#$%^&*(),.?":{}]+$';
  ProgressSpinnerDlg: boolean = false;
  uploadtype: string;
  ModalOptions: PrintDownloadOptions;

  categoryName: boolean = true;
  subcategory: boolean = true;
  brand: boolean = true;
  product: boolean = true;

  updatecatalog: UpdateMerchantCatalogDto = {
    MerchantCatalogId: 0,
    MerchantID: 0,
    CategoryID: 0,
    Subcategory: null,
    Brand: null,
    Product: null
  }
  addcatalog: InsetMerchantCatalogDto = {
    merchantID: 0,
    type: null,
    MerchantCatalog: null
  }

  deletecatalog: DeleteMerchantCatalogDto = {
    merchantCatalogId: 0
  }

  constructor(private merchantservice: MerchantService, private excelService: ExcelService,
    private fb: FormBuilder, private categservice: CategoryService,
    private catalogservice: MerchantCatalogService, private localStorage: LocalStorageService) { }

  ngOnInit() {

    this.cols = [
      { field: 'categoryName', header: 'Category Name' },
      { field: 'subcategory', header: 'Sub Category' },
      { field: 'brand', header: 'Brand' },
      { field: 'product', header: 'Product' },
    ];

    this.uploadtype = "Append";
    this.bindmerchants();
    this.merchantCatlogForm = this.fb.group({
      categoryName: ['', Validators.required],
      subcategory: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      brand: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      product: ['', [Validators.required, Validators.pattern(this.namepattern)]]
    });
  }

  bindmerchants() {
    this.ProgressSpinnerDlg = true;
    this.merchants.length = 0;
    this.merchants.push({ label: 'Select Merchant', value: 0 });
    this.catalogservice.Getmerchantswithcategories().subscribe(res => {
      this.merchantswith_categories = res;
      Object.keys(res).map(key => (
        this.merchants.push({ label: res[key]["merchantName"], value: res[key]["merchantID"] })
      ));
      this.ProgressSpinnerDlg = false;
    });
  }

  formvalidate() {
    if (this.merchantCatlogForm.valid) {
      this.btndisable = "line_btn sblue mr-4";
    }
    else {
      this.btndisable = "disable";
    }
  }

  Merchantdata(data) {
    this.ProgressSpinnerDlg = true;
    if (data.value != 0) {
      this.localStorage.set("merchantid", data.value);
      this.catalogservice.Cataloglistbymerchant(data.value).subscribe(x => {
        this.merchant_catalog_data = x;
        this.merchant_catlog_list = this.merchant_catalog_data;
        this.ProgressSpinnerDlg = false;

      });
      this.btnform = false;
    }
    else {
      this.btnform = true;
    }
    this.bindcategories(data.value);
  }
  incomingfile(event) {
    this.file = event.target.files[0];
    this.importToExcel();
  }

  onRowSelect(event) {
    this.secondbtn = "Delete";
    this.updatecatalog.MerchantCatalogId = event.data["id"];
    this.updatecatalog.MerchantID = event.data["merchantID"];
    let catid: number;
    this.categories.forEach(catitem => {
      if (catitem["label"] === event.data["categoryName"]) {
        catid = catitem["value"];
      }
    });
    this.merchantCatlogForm.controls['categoryName'].setValue(catid);
    this.merchantCatlogForm.controls['subcategory'].setValue(event.data["subcategory"]);
    this.merchantCatlogForm.controls['brand'].setValue(event.data["brand"]);
    this.merchantCatlogForm.controls['product'].setValue(event.data["product"]);
    this.btndisable = "line_btn sblue mr-4";
    this.modelheader = "Update";
    this.editmerchentdisplay = true;
  }

  redirectcustomerlist(actiontype) {
    if (actiontype === "Cancel") {
      this.response="";
      this.editmerchentdisplay = false;
    }
    else if (actiontype === "Delete") {
      this.yesbtndisable = "";
      this.deletedisplay = true;
    }
  }

  onClose() {
    this.displayUpload = false;
    this.exceluploadresponse = "";
    this.uploadbtndisable = "disable";
    this.worksheetdata.length = 0;
  }

  ondeleteClose() {
    this.deletedisplay = false;
  }

  onDialogClose(event) {
    this.display = event;
    this.Getmerchantcataloglist();
  }
  oneditClose() {
    this.response="";
    this.editmerchentdisplay = false;
    this.Getmerchantcataloglist();
  }

  Getmerchantcataloglist() {
    this.catalogservice.Cataloglistbymerchant(this.localStorage.get("merchantid")).subscribe(x => {
      this.merchant_catalog_data = x;
      this.merchant_catlog_list = this.merchant_catalog_data;
    });
  }

  importToExcel() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];

      var worksheet = workbook.Sheets[first_sheet_name];
      this.get_header_row(worksheet);

      this.worksheetdata = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.uploadbtndisable = "";

    }
    fileReader.readAsArrayBuffer(this.file);
  }

  get_header_row(sheet) {
    this.headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r; 
    for (C = range.s.c; C <= range.e.c; ++C) {
      var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })] 

      if (cell != undefined) {
        var hdr = "UNKNOWN " + C; 
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);

        this.headers.push(hdr);
      }

    }
  }

  Addmerchents() {
    this.ResetForm();
    this.modelheader = "Add";
    this.editmerchentdisplay = true;
    this.btndisable = "disable";
    this.secondbtn = "Cancel";
  }

  updatemerchantvalues(header) {

    if (header === "Update") {
      this.ProgressSpinnerDlg = true;
      this.updatecatalog.Brand = this.merchantCatlogForm.value["brand"];
      this.updatecatalog.Product = this.merchantCatlogForm.value["product"];
      this.updatecatalog.Subcategory = this.merchantCatlogForm.value["subcategory"];
      this.updatecatalog.CategoryID = this.merchantCatlogForm.value["categoryName"];

      this.catalogservice.UpdateCatalog(this.updatecatalog).subscribe(res => {
        this.ProgressSpinnerDlg = false;
        this.response = res["result"];
        this.responsesty = "succsmsg";
        this.btndisable = "disable";
        setTimeout(() => {
          this.oneditClose();
          this.response = "";
          this.btndisable = "";
        }, 2000);
      },
        error => {
          this.ProgressSpinnerDlg = false;
          this.btndisable = "";
          this.response = error["error"]["result"];
          this.responsesty = "errormsg";
     
        });
    }
    else if (header === "Add") {
      this.ProgressSpinnerDlg = true;

      let cataloglist: any[] = [];
      this.addcatalog.merchantID = parseInt(this.localStorage.get("merchantid"));
      this.addcatalog.type = "D";

      this.categories.forEach(x => {
        if (x["value"] === this.merchantCatlogForm.value["categoryName"]) {
          this.merchantCatlogForm.value["categoryName"] = x["label"];
        }
      });

      cataloglist.push(this.merchantCatlogForm.value);
      this.addcatalog.MerchantCatalog = cataloglist;

      this.catalogservice.Insertcatalog(this.addcatalog).subscribe(res => {
        this.ProgressSpinnerDlg = false;
        this.response = res["result"];
        this.responsesty = "succsmsg";
        this.btndisable = "disable";
        setTimeout(() => {
          this.oneditClose();
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
     
        });

    }
  }

  redirectocataloglist() {
    this.displayUpload = false;
  }

  bindcategories(id) {

    this.categories.length = 0;
    this.merchantswith_categories.forEach(catg => {

      if (catg["merchantID"] == id) {
        catg["merchantCategory"].forEach(key => {
          this.categories.push({ label: key["categoryName"], value: key["categoryId"] })
        });
        this.parentMessage = catg["merchantCategory"];
      }
    });

  }

  showDialog() {
    this.displayUpload = true;
  }

  uploadexcel() {
    let catdata = [];
    let colmns: any[] = [];

    this.cols.forEach(x => {
      colmns.push(x["header"]);
    });

    if (JSON.stringify(this.headers) === JSON.stringify(colmns)) {
      if (this.worksheetdata.length >= 1) {
        this.worksheetdata.map(function (item) {
          let catalogitem: any = {};
          catalogitem.CategoryName = item["Category Name"];
          catalogitem.SubCategory = item["Sub Category"];
          catalogitem.Product = item["Product"];
          catalogitem.Brand = item["Brand"];
          catdata.push(catalogitem);
        });
        this.addcatalog.merchantID = parseInt(this.localStorage.get("merchantid"));
        this.addcatalog.MerchantCatalog = catdata;

        if (this.uploadtype == "Overwrite") {
          this.addcatalog.type = "O";
        }
        else if (this.uploadtype == "Append") {
          this.addcatalog.type = "A";
        }
        this.catalogservice.Insertcatalog(this.addcatalog).subscribe(res => {
          this.ProgressSpinnerDlg = false;
          this.exceluploadresponse = res["result"];
          this.responsesty = "succsmsg";
          this.uploadbtndisable = "disable";
          setTimeout(() => {
            this.onClose();
            this.Getmerchantcataloglist();
            this.exceluploadresponse = "";
            this.uploadbtndisable = "";
          }, 2000);
        },
          error => {
            this.ProgressSpinnerDlg = false;
            this.uploadbtndisable = "";
            this.exceluploadresponse = error["error"]["result"];
            this.responsesty = "errormsg";
          });
      }
      else {
        this.exceluploadresponse = "Catalog file must contain data";
        this.responsesty = "errormsg";
      }
    }
    else {
      this.exceluploadresponse = "Invalid catalog template";
      this.responsesty = "errormsg";
    }
  }

  ConfirmDeletecatalog() {
    this.deletecatalog.merchantCatalogId = this.updatecatalog.MerchantCatalogId;

    this.ProgressSpinnerDlg = true;

    this.catalogservice.DeleteCatalogy(this.deletecatalog).subscribe(res => {

      this.deleteresponse = res["result"];
      this.responsesty = "succsmsg";
      this.yesbtndisable = "disable";
      setTimeout(() => {
        this.ProgressSpinnerDlg = false;

        this.yesbtndisable = "";
        this.ondeleteClose();
        this.editmerchentdisplay = false;
        this.Getmerchantcataloglist();
        this.deleteresponse = "";
      }, 2000);
    },
      error => {
        this.ProgressSpinnerDlg = false;
        this.yesbtndisable = "";

        this.deleteresponse = error["error"]["result"];
        this.responsesty = "errormsg";
      });

  }

  Closedeletedialog() {
    this.deletedisplay = false;
  }

  exportToExcel() {

    let merchantname: any;

    this.merchantswith_categories.forEach(item => {
      if (item["merchantID"] == this.localStorage.get("merchantid")) {

        merchantname = item["merchantName"];
      }
    });

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
      this.ModalOptions.tableData = this.merchant_catlog_list;
    }
    this.ModalOptions.fileName = merchantname + "_" + moment(new Date()).format('YYYY/MM/DD').toString();

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
        this.ModalOptions.tableData = this.merchant_catlog_list;
      }
      else {
        this.ModalOptions.tableData = this._table.filteredValue;
      }
    }
    else {
      this.ModalOptions.tableData = this.merchant_catlog_list;
    }

    if (this.ModalOptions.tableData.length == 0) {
    }
    else {
    }
  }

  catlogtemplate() {
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

    this.ModalOptions.fileName = 'catlog_template';

    for (const column of this.ModalOptions.columns) {
      let data = column.header;
      data = data === 'undefined' ? '' : data;
      data = data === null ? '' : data;
      data = data === 'null' ? '' : data;
      headerString += data + ',';

    }
    csv += headerString + '\n';


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

  exportAsXLSX(): void {

    this.merchant_catalog_template = [{ "Category Name": null, "Sub Category": null, "Brand": null, "Product": null }];
    this.excelService.exportAsExcelFile(this.merchant_catalog_template, 'catlog_template');
  }

  showfilter(col) {

    if (col === "categoryName") {

      this.categoryName = !this.categoryName;
    } else if (col === "subcategory") {
      this.subcategory = !this.subcategory;
    } else if (col === "brand") {

      this.brand = !this.brand;
    } else if (col === "product") {

      this.product = !this.product;
    }
  }


  ResetForm() {
    this.merchantCatlogForm.reset({
      'categoryName': '',
      'subcategory': '',
      'brand': '',
      'product': ''
    });
  }

  onClick() {
    this.table.reset();
    this.categoryName = true;
    this.subcategory = true;
    this.brand = true;
    this.product = true;
  }
  uploadedfiltypechange() {
    this.exceluploadresponse = "";
  }
}
