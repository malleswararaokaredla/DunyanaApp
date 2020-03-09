import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  items: MenuItem[];
  disableitem:boolean=false;
  constructor(private localStorage: LocalStorageService, private router: Router) { }

  ngOnInit() {

    this.items = [
      {label: 'Profile', 
      routerLink: '/admin/profile'},
      
      {label: 'Categories', 
      routerLink:(this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?"": '/admin/categorylist',

      disabled: (this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?true:false },
      
      {label: 'Users', 
      routerLink:(this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?"": '/admin/userslist',
      disabled: ((this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")) ?true:false},    
      
      {label: 'Finance', 
      routerLink:(this.localStorage.get("loginType")!="NF")&& (this.localStorage.get("loginType")!="NSA")?"":'/admin/naqel-finance-team',
      disabled:((this.localStorage.get("loginType")!="NF")&& (this.localStorage.get("loginType")!="NSA"))?true:false},

      {label: 'Legal',
      routerLink:(this.localStorage.get("loginType")!="NL")&& (this.localStorage.get("loginType")!="NSA")?"":'/admin/naqel-legal-team',
      disabled: (this.localStorage.get("loginType")!="NL")&& (this.localStorage.get("loginType")!="NSA")?true:false},

      {label: 'Contract',
      routerLink:(this.localStorage.get("loginType")!="NL")&& (this.localStorage.get("loginType")!="NSA")?"":'/admin/naqel-contract-team',
      disabled: (this.localStorage.get("loginType")!="NL")&& (this.localStorage.get("loginType")!="NSA")?true:false},
    
      {label:'Merchant redirect',
      routerLink:(this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?"": '/admin/merchentcaptureparameters',

      disabled: (this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?true:false },
    
      {label:'Merchant catalog',
      routerLink:(this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?"": '/admin/merchent-catalog',

      disabled: (this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?true:false },

      {label:'Promotions',
      routerLink:(this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?"": '/admin/promotions',

      disabled: (this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?true:false },
    
       {label:'Points and cashback',
       routerLink:(this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?"": '/admin/merchantCredits',

       disabled: (this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?true:false },

      {label: ' Orders',
      routerLink:(this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?"": '/admin/orders',

      disabled: (this.localStorage.get("loginType")==="NF")||(this.localStorage.get("loginType")==="NL")||(this.localStorage.get("loginType")==="NC")?true:false }

      // {label: 'Categories', routerLink: '',disabled:true },
      // {label: 'Users', routerLink: '',disabled:true },    
      // {label: 'Finance', routerLink:this.localStorage.get("loginType")!="NF"?"":'/naqel/naqel-finance-team', disabled: this.localStorage.get("loginType")!="NF"?true:false},
      // {label: 'Legal',routerLink:this.localStorage.get("loginType")!="NL"?"":'/naqel/naqel-legal-team', disabled: this.localStorage.get("loginType")!="NL"?true:false},
      // {label: 'Contract',routerLink:this.localStorage.get("loginType")!="NC"?"":'/naqel/naqel-contract-team',disabled: this.localStorage.get("loginType")!="NC"?true:false}
       
  ];
  }

}
