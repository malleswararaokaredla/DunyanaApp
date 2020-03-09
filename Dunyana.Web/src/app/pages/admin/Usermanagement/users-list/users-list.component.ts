import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { user } from '../../model/user';
import { RegistrationDto } from 'src/app/pages/customer/model/DTOs/RegistraionDto';
import { UsermanagementService } from 'src/app/pages/customer/services/usermanagement.service';
import * as _ from 'underscore';
import { PrintDownloadOptions } from 'src/app/shared/dto/PrintDownloadOptionsDto';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  @ViewChild('dtNaqel') private _Usertable: Table;
  @ViewChild('dtCustomers') private _customertable: Table;
  @ViewChild('dtMerchants') private _merchanttable: Table;

  response: string = "";
  responsesty: string = "";
  @Output() displayChange = new EventEmitter();
  naqelUserTypes: any[] = [];
  ProgressSpinnerDlg: boolean = false;
  countries: any[] = [];
  country: string;
  naqelUserType: string;
  naqelUserslist: any[] = [];
  userslist: any[] = [];
  customers: any[] = [];
  merchants: any[] = [];
  selecteduser: any;
  customerCols: any[] = [];
  merchantCols: any[] = [];
  naqelUserCols: any[] = [];
  edituserdisplay: boolean = false;
  userForm: FormGroup;
  display: boolean = false;
  btndisable: string = "disable";
  editUserdisplay: boolean = false;
  index: number = 0;
  showAdd: boolean = true;
  userStatuses: any[] = [];
  selectedUserId: number;
  isNaqeluser: boolean;
  ModalOptions: PrintDownloadOptions;
  isMerchant: boolean;
  selectedSearchCol: string;
  excelDown: boolean = false;

  userDto: user = {
    id: 0,
    firstName: null,
    lastName: null,
    address: null,
    name: null,
    email: null,
    mobile: null,
    country: null,
    userType: null,
    isActive: null,
    createdDate: null,
    naqelUserType: null,
    loginStatus: null,
    result: null,
    company: null
  }
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

  userName: boolean = true;
  email: boolean = true;
  mobile: boolean = true;
  isActive: boolean = true;
  userType: boolean = true;
  ucountry: boolean = true;

  cuserName: boolean = true;
  cemail: boolean = true;
  cmobile: boolean = true;
  cisActive: boolean = true;
  ccountry: boolean = true;

  muserName: boolean = true;
  memail: boolean = true;
  mcompany: boolean = true;
  mcountry: boolean = true;
  misActive: boolean = true;

  profiledata = this.registerdto;
  namepattern: string = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';
  constructor(private fb: FormBuilder, private userService: UserService, private customerMerchantService: UsermanagementService
  ) {
    this.userStatuses = [
      { label: 'Active', value: '1' },
      { label: 'InActive', value: '0' }
    ];
    /* this.userTypes = [
      { label: 'Select', value: '' }, 
      { label: 'Legal',value: 18 },
      { label: 'Finance',value: 19 },
      { label: 'Contract',value: 20 }
    ]; */
  }

  ngOnInit() {
    this.isMerchant = false;
    this.isNaqeluser = true;

    this.userForm = this.fb.group({

      firstname: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      lastname: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{2,}')]],
      isActive: ['', [Validators.required]],
      userType: ['', [Validators.required]],
      company: ['']

    });
    this.ProgressSpinnerDlg = true;
    this.GetUserList();

    this.userForm.controls['isActive'].setValue(this.userStatuses[0]["value"], { onlySelf: true });

    this.customerCols = [
      { field: 'userName', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'mobile', header: 'Mobile' },
      { field: 'country', header: 'Country' },
      { field: 'isActive', header: 'Active' },

    ];

    this.merchantCols = [
      { field: 'userName', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'company', header: 'Company' },
      { field: 'country', header: 'Country' },
      { field: 'isActive', header: 'Active' },

    ];

    this.naqelUserCols = [
      { field: 'userName', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'mobile', header: 'Mobile' },
      { field: 'country', header: 'Country' },
      { field: 'isActive', header: 'Active' },
      { field: 'userType', header: 'User Type' }
    ];

    if (this.index == 0) {
      if (this.naqelUserslist.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    }
    else if (this.index == 1) {
      if (this.customers.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    }
    else if (this.index == 2) {
      if (this.merchants.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    }

  }
  GetProfiledata(customerMerchantEmail: string, customerMerchantType: string) {


    this.registerdto.Email = customerMerchantEmail;
    this.registerdto.Type = customerMerchantType;
    this.customerMerchantService.GetProfileInformation(this.registerdto).subscribe(res => {
      if (res["status"] == 0) {
        this.userForm.controls['isActive'].setValue(this.userStatuses[1]["value"], { onlySelf: true });
      }
      else {
        this.userForm.controls['isActive'].setValue(this.userStatuses[0]["value"], { onlySelf: true });
      }
      this.userForm.controls['firstname'].setValue(res["firstName"]);
      this.userForm.controls['lastname'].setValue(res["lastName"]);
      this.userForm.controls['address'].setValue(res["address"]);
      this.country = res["country"];
      this.userForm.controls['email'].setValue(res["email"]);
      this.userForm.controls['mobile'].setValue(res["mobile"]);
      this.userForm.controls['company'].setValue(res["company"]);
      if (this.isNaqeluser) {
        this.naqelUserType = res["naqelUserType"];
      }

      this.GetCountriesList();
      this.GetNaqelUserTypes();
    });
  }
  onRowSelect(event) {

    this.selectedUserId = event.data["id"];
    if (this.index === 1) {
      this.GetProfiledata(event.data['email'], "C");
      this.isMerchant = false;
    }
    else if (this.index == 2) {
      this.GetProfiledata(event.data['email'], "M");
      this.isMerchant = true;
    }
    else {
      this.GetProfiledata(event.data['email'], "N");
      this.isMerchant = false;

    }



    this.edituserdisplay = true;
    this.btndisable = "line_btn sblue mr-4";
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('noscroll');
    this.clearForm();
  }



  GetUserList() {
    this.userService.UserList().subscribe(res => {
      this.naqelUserslist = res[0]['naqelusers'];
      this.customers = res[0]['customers'];
      this.merchants = res[0]['merchants'];
      this.userslist = this.naqelUserslist.concat(this.customers);
      this.userslist = this.userslist.concat(this.merchants);
      if (this.userslist.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
      this.ProgressSpinnerDlg = false;
    });
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
      columns: ExcelColumns,
      reportHeaderColumns: '',
      reportFooterColumns: ''

    };

    if (this.index === 0) {
      if (this._Usertable.hasFilter()) {
        this.ModalOptions.tableData = this._Usertable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.naqelUserslist;
      }

      if (this.ModalOptions.tableData.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    }

    else if (this.index === 1) {

      if (this._customertable.hasFilter()) {
        this.ModalOptions.tableData = this._customertable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.customers;
      }

      if (this.ModalOptions.tableData.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    }


    else if (this.index === 2) {


      if (this._merchanttable.hasFilter()) {
        this.ModalOptions.tableData = this._merchanttable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.merchants;
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
      columns: ExcelColumns,
      reportHeaderColumns: '',
      reportFooterColumns: ''

    };
    if (this.index === 0) {

      if (this._Usertable.hasFilter()) {

        if (this._Usertable.filteredValue === null) {
          this.ModalOptions.tableData = this.naqelUserslist;
        }
        else {
          this.ModalOptions.tableData = this._Usertable.filteredValue;
        }

      }
      else {
        this.ModalOptions.tableData = this.naqelUserslist;
      }

      //this.ModalOptions.tableData = this.naqelUserslist;
      this.ModalOptions.fileName = 'Naqel Users';
    }
    else if (this.index === 1) {

      if (this._customertable.hasFilter()) {

        if (this._customertable.filteredValue === null) {
          this.ModalOptions.tableData = this.customers;
        }
        else {
          this.ModalOptions.tableData = this._customertable.filteredValue;
        }
      }
      else {
        this.ModalOptions.tableData = this.customers;
      }

      // this.ModalOptions.tableData = this.customers;
      this.ModalOptions.fileName = 'Customers';
      this.ModalOptions.columns = ExcelCustomerColumns;

    }
    else if (this.index === 2) {


      if (this._merchanttable.hasFilter()) {

        if (this._merchanttable.filteredValue === null) {
          this.ModalOptions.tableData = this.merchants;
        }
        else {
          this.ModalOptions.tableData = this._merchanttable.filteredValue;
        }

      }
      else {
        this.ModalOptions.tableData = this.merchants;
      }

      // this.ModalOptions.tableData = this.merchants;
      this.ModalOptions.fileName = 'Merchants';
      this.ModalOptions.columns = ExcelMerchantColumns;
    }

    // get column headers
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
      this._Usertable.reset();
      this.userName = true;
      this.email = true;
      this.mobile = true;
      this.ucountry = true;
      this.isActive = true;
      this.userType = true;
      this.excelDown = false;
    }
    else if (this.index === 1) {
      this._customertable.reset();
      this.cuserName = true;
      this.cemail = true;
      this.cmobile = true;
      this.ccountry = true;
      this.cisActive = true;
      this.excelDown = false;
    }
    else if (this.index === 2) {
      this._merchanttable.reset();
      this.muserName = true;
      this.memail = true;
      this.mcompany = true;
      this.mcountry = true;
      this.misActive = true;
      this.excelDown = false;
    }

  }


  AddUser() {
    this.display = true;
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('noscroll');
  }

  onDialogClose(event) {
    this.display = false;
    this.GetUserList();
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('noscroll');
  }
  onClose() {
    this.displayChange.emit(false);
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('noscroll');
  }
  redirectusertable() {
    this.displayChange.emit(false);
    this.edituserdisplay = false;
    this.GetUserList();
  }
  changeTab(e) {
    this.index = e.index;
    // if (this.index === 1) {
    //   this.isNaqeluser = false;
    //   this.showAdd = false;

    // }
    // else if (this.index === 2) {
    //   this.isNaqeluser = false;
    //   this.showAdd = false;

    // }
    // else if (this.index === 0) {
    //   this.isNaqeluser = true;
    //   this.showAdd = true;

    // }



    this.ModalOptions = {
      key: '',
      fileName: '',
      dialogHeader: '',
      dialogMessage: '',
      enableDownloadExcel: true,
      enablePrint: true,
      dataSource: '',
      tableData: '',
      columns: ExcelColumns,
      reportHeaderColumns: '',
      reportFooterColumns: ''

    };

    if (this.index === 0) {
      this.isNaqeluser = true;
      this.showAdd = true;

      if (this._Usertable.hasFilter()) {
        this.ModalOptions.tableData = this._Usertable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.naqelUserslist;
      }

      if (this.ModalOptions.tableData.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    }

    else if (this.index === 1) {
      this.isNaqeluser = false;
      this.showAdd = false;

      if (this._customertable.hasFilter()) {
        this.ModalOptions.tableData = this._customertable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.customers;
      }

      if (this.ModalOptions.tableData.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }
    }


    else if (this.index === 2) {
      this.isNaqeluser = false;
      this.showAdd = false;
      if (this._merchanttable.hasFilter()) {
        this.ModalOptions.tableData = this._merchanttable.filteredValue;
      }
      else {
        this.ModalOptions.tableData = this.merchants;
      }

      if (this.ModalOptions.tableData.length == 0) {
        this.excelDown = true;
      }
      else {
        this.excelDown = false;
      }

    }
  }
  updateUser() {
    this.ProgressSpinnerDlg = true;
    this.userDto.id = this.selectedUserId;
    this.userDto.isActive = this.userForm.value["isActive"];
    this.userDto.userType = 'N';
    if (this.index === 1) {
      this.userDto.userType = 'C';
    }
    else if (this.index === 2) {
      this.userDto.userType = 'M';
    }
    else {
      this.userDto.firstName = this.userForm.value["firstname"];
      this.userDto.lastName = this.userForm.value["lastname"];
      this.userDto.mobile = this.userForm.value["mobile"];
      this.userDto.country = this.userForm.value["country"];
      this.userDto.email = this.userForm.value["email"];
      this.userDto.address = this.userForm.value["address"];
      this.userDto.naqelUserType = this.userForm.value["userType"];


    }
    this.userService.UpdateUser(this.userDto).subscribe(res => {
      this.response = "Changes updated successfully";
      this.responsesty = "succsmsg";
      this.btndisable = "disable";
      this.HideResponse();
      setTimeout(() => {
        this.btndisable = "";
        this.redirectusertable();
      }, 3000);
      this.ProgressSpinnerDlg = false;
    },
      error => {
        this.ProgressSpinnerDlg = false;
      });

  }
  HideResponse() {
    setTimeout(() => {
      this.response = "";
    }, 3000);
  }
  GetCountriesList() {
    this.countries.length = 0;
    this.userService.GetCountriesList().subscribe(res => {
      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"] })
      ));
      this.countries = _.sortBy(this.countries, 'label');
      let countryId;

      this.countries.forEach(x => {
        if (x["label"] === this.country) {
          countryId = x["value"];
        }
      });

      this.userForm.controls['country'].setValue(countryId);
    });

  }

  GetNaqelUserTypes() {
    this.naqelUserTypes.length = 0;
    this.userService.getNaqelUserTypes().subscribe(res => {
      Object.keys(res).map(key => (
        this.naqelUserTypes.push({ label: res[key]["description"], value: res[key]["id"] })
      ));
      this.naqelUserTypes = _.sortBy(this.naqelUserTypes, 'label');
      let userTypeId;

      this.naqelUserTypes.forEach(x => {
        if (x["value"] === this.naqelUserType) {
          userTypeId = x["value"];
        }
      });

      this.userForm.controls['userType'].setValue(userTypeId);
    });

  }
  _keyPress(event: any) {
    const pattern = /^([0-9]+ )+[0-9]+$|^[0-9]+$/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  formvalidate() {

    if (this.index === 1) {
      this.userForm.controls['userType'].setValue('C');
    }
    else if (this.index === 2) {
      this.userForm.controls['userType'].setValue('M');
      this.userForm.controls['mobile'].setValue('9999999999');
      this.userForm.controls['address'].setValue('NA');
      // this.userForm.controls['firstname'].setValue('NA');
      this.userForm.controls['lastname'].setValue('NA');

    }

    let countryId;

    this.countries.forEach(x => {
      if (x["label"] === this.country.toString()) {
        countryId = x["value"];
      }
    });

    this.userForm.controls['country'].setValue(countryId);
    if (this.userForm.valid) {
      this.btndisable = "line_btn sblue mr-4";
    }
    else {

      this.btndisable = "disable";
    }
  }

  showfilter(col) {
    if (col === "userName") {

      this.userName = !this.userName;
    } else if (col === "email") {

      this.email = !this.email;
    } else if (col === "mobile") {

      this.mobile = !this.mobile;
    } else if (col === "country") {

      this.ucountry = !this.ucountry;
    } else if (col === "isActive") {

      this.isActive = !this.isActive;
    } else if (col === "userType") {

      this.userType = !this.userType;
    }
  }

  showcustomerfilter(col) {
    if (col === "userName") {

      this.cuserName = !this.cuserName;
    } else if (col === "email") {

      this.cemail = !this.cemail;
    } else if (col === "mobile") {

      this.cmobile = !this.cmobile;
    } else if (col === "country") {

      this.ccountry = !this.ccountry;
    } else if (col === "isActive") {

      this.cisActive = !this.cisActive;
    }
  }

  showmerchantfilter(col) {
    if (col === "userName") {

      this.muserName = !this.muserName;
    } else if (col === "email") {

      this.memail = !this.memail;
    } else if (col === "company") {

      this.mcompany = !this.mcompany;
    } else if (col === "country") {

      this.mcountry = !this.mcountry;
    } else if (col === "isActive") {

      this.misActive = !this.misActive;
    }
  }

  clearForm() {

    this.userForm.reset({
      'firstname': '',
      'lastname': '',
      'mobile': '',
      'address': '',
      'country': '',
      'email': '',
      'isActive': '',
      'userType': '',
      'company': ''
    });
    this.btndisable = "disable";
  }
}
export const ExcelColumns = [
  { field: 'userName', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'mobile', header: 'Mobile' },
  { field: 'address', header: 'Address' },
  { field: 'country', header: 'Country' },
  { field: 'isActive', header: 'Active' },
  { field: 'userType', header: 'User Type' }

];
export const ExcelMerchantColumns = [
  { field: 'userName', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'company', header: 'Company' },
  { field: 'country', header: 'Country' },
  { field: 'isActive', header: 'Active' }


];
export const ExcelCustomerColumns = [
  { field: 'userName', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'mobile', header: 'Mobile' },
  { field: 'address', header: 'Address' },
  { field: 'country', header: 'Country' },
  { field: 'isActive', header: 'Active' }


];


