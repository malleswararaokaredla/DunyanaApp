import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { user } from '../../model/user';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import * as _ from 'underscore';
@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  response: string = "";
  responsesty: string = "";
  ProgressSpinnerDlg: boolean = false;
  countries: any[] = [];
  country: string = "";
  naqelUserType: string ='';
  userStatuses: any[] = [];
  naqelUserTypes: any[] = [];
  namepattern:string='^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';
  emailPattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+.[A-Za-z]{2,3}$';
  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();
    userForm: FormGroup;
    btndisable: string = "disable";
     userDto: user = {
          id: 0,
          firstName: null,
          lastName: null,
          address: null,
          name: null,
          email:  null, 
          mobile: null,
          country: null,
          userType:  null, 
          isActive:  null,
          createdDate: null,
          naqelUserType: null,
          loginStatus: null,
          result: null,
          company: null
  }
  constructor(private fb: FormBuilder, private userService: UserService, private messageService: MessageService) {
    this.userStatuses = [
      { label: 'Select', value: '' },
      { label: 'Active', value: '1' },
      { label: 'InActive', value: '0' }
    ];
  /*   this.userTypes = [
      { label: 'Select', value: '' }, 
      { label: 'Legal',value: '18' },
      { label: 'Finance',value: '19' },
      { label: 'Contract',value: '20' }
    ]; */
   }

  ngOnInit() {    
    this.userForm = this.fb.group({
     firstname: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      lastname: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      mobile: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      address: ['',[Validators.required]],
      country: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.pattern(this.emailPattern)]],
      isActive: ['',[Validators.required]],
      userType: ['',[Validators.required]]

      

    });     
    this.GetCountriesList();
    this.GetNaqelUserTypes();
    this.userForm.controls['isActive'].setValue(this.userStatuses[0]["value"], { onlySelf: true });
   
   
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
      'userType': ''
     });
      this.btndisable="disable";
      this.response  = '';
}
   AddUser() {
    this.ProgressSpinnerDlg = true;
    this.btndisable="disable";
      this.userDto.firstName = this.userForm.value["firstname"];
      this.userDto.lastName = this.userForm.value["lastname"];
      this.userDto.email = this.userForm.value["email"];
      this.userDto.mobile = this.userForm.value["mobile"];
      this.userDto.address = this.userForm.value["address"];
      this.userDto.country = this.userForm.value["country"];
      this.userDto.isActive = this.userForm.value["isActive"];
      this.userDto.naqelUserType = this.userForm.value["userType"];
  
    

    this.userService.AddUser(this.userDto).subscribe(res => {
       switch (res.loginStatus) {
              case 'S': {
                 this.response = res.result;
                  this.responsesty = "succsmsg";
                  this.btndisable="disable";
                  this.HideResponse();
                  setTimeout(() => {
                      this.clearForm();
                    //  this.btndisable="";
                  this.redirectUserlist();
                
                  }, 3000);
                  this.ProgressSpinnerDlg = false;
                      break;
              }
            case 'F': {
                 this.response = res.result;
                  this.responsesty = "errormsg";
                  this.ProgressSpinnerDlg = false;
                  this.btndisable="";
                      break;
              }       }
     
     
    },
      error => {
         this.ProgressSpinnerDlg = false;
         this.btndisable="";
          this.responsesty = "errormsg";
         this.response = "Failed to add new naqel";
      });
     }
     HideResponse() {
      setTimeout(() => {
        this.response = "";
      }, 3000);
    }
    redirectUserlist() {
    this.displayChange.emit(false);
  }
  onClose() {
    this.clearForm();
    this.displayChange.emit(false);
  }

  GetCountriesList() {
    this.userService.GetCountriesList().subscribe(res => {
      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"] })

      ));
    
      this.countries.push({ label: 'Select', value: '' });
      this.userForm.controls['country'].setValue(this.country);
      this.countries = _.sortBy(this.countries, 'label');
    });

  }
  GetNaqelUserTypes() {
    this.naqelUserTypes.length=0;
    this.userService.getNaqelUserTypes().subscribe(res => {
      Object.keys(res).map(key => (
        this.naqelUserTypes.push({ label: res[key]["description"], value: res[key]["id"] })
      ));
      this.naqelUserTypes.push({ label: 'Select', value: '' })
      this.naqelUserTypes = _.sortBy(this.naqelUserTypes, 'label');
      this.userForm.controls['userType'].setValue(this.naqelUserType);
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
    if (this.userForm.valid) {
      this.btndisable = "line_btn sblue mr-4"; 
    }
    else {

      this.btndisable = "disable";
    }
  }
  
}
