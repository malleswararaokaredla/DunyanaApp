import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from 'angular-web-storage';
import { MerchantRedirectionDto } from 'src/app/pages/merchant/modal/MerchantRedirectionDto';
import { MerchantService } from 'src/app/pages/merchant/services/merchant.service';


@Component({
  selector: 'app-add-merchant-param',
  templateUrl: './add-merchant-param.component.html',
  styleUrls: ['./add-merchant-param.component.scss']
})
export class AddMerchantParamComponent implements OnInit {

  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();
  merchentForm: FormGroup;
  categorystatus: any[] = [];
  categorypriority: any[] = [];
  btndisable: string = "disable";
  merchentid:number;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  finalImage: any = '';
  ProgressSpinnerDlg: boolean = false;
  merchentlist: Array<any> = [];
  @ViewChild('adddiv')adddiv:ElementRef;
  responsesty: string = "";

  _MerchantRedirectionDto: MerchantRedirectionDto = {
   
    merchantRedirectionId:0,
    MerchantAttribute: null,
    MerchantValue: null,
    MerchantDescription: null
  }


  constructor(private fb: FormBuilder,  private merchantservice: MerchantService,private messageService: MessageService,private localStorage: LocalStorageService) {
  
  }

  ngOnInit() {
    this.merchentid=parseInt(this.localStorage.get("merchantparmid"));

    this.merchentForm = this.fb.group({
      MerchantAttribute: ['', Validators.required],
      MerchantValue: ['', Validators.required],
      MerchantDescription: ['', Validators.required],
    });

  }

  get category() {
    return this.merchentForm.get('category') as FormArray;
  }

  addSellingPoint() {
    this.category.push(this.fb.group(
      {
        Id: ['', Validators.required],
        Name: ['', Validators.required],
      }
    ));
  }

  deleteSellingPoint(index) {
  }
  formvalidate() {
    if (this.merchentForm.valid) {
      this.btndisable = "line_btn sblue mr-4";
    }
    else {
      this.btndisable = "disable";
    }
  }

  hidemsgdiv(){
    setTimeout(()=>{
      this.adddiv.nativeElement.innerHTML="";
    },5000);
  }

  onClose() {
    this.displayChange.emit(false);
  }
  redirectcustomerlist() {
 
    this.displayChange.emit(false);
    this.bindmerchentdata();
  }

  Addmerchentvalues() {
 
    this._MerchantRedirectionDto.merchantRedirectionId=0;
    this._MerchantRedirectionDto.MerchantAttribute = this.merchentForm.value["MerchantAttribute"];
    this._MerchantRedirectionDto.MerchantDescription = this.merchentForm.value["MerchantDescription"];
    this._MerchantRedirectionDto.MerchantValue = this.merchentForm.value["MerchantValue"];
  
    this.merchentlist.push(this._MerchantRedirectionDto);
  
    this.ProgressSpinnerDlg=true;
    this.merchantservice.merchenturlparams(this._MerchantRedirectionDto,parseInt(this.localStorage.get("merchantparmid"))).subscribe(res => {    
      this.ProgressSpinnerDlg=false;
      this.responsesty = "succsmsg";
      this.btndisable="disable";
       this.adddiv.nativeElement.innerHTML=res["result"];
       this.hidemsgdiv();
      setTimeout(() => {
        this.btndisable="";
        this.redirectcustomerlist();
      }, 2000);
    
      this.Resetform();
    },
      error => {
        this.ProgressSpinnerDlg=false;
        this.responsesty = "errormsg";
        this.adddiv.nativeElement.innerHTML=error["error"]["result"];
        this.hidemsgdiv();        
      });
  }

  bindmerchentdata(){
    this.merchantservice.Getmerchantdetials(this.merchentid).subscribe(res=>{   
      this.merchentlist=res['merchantRedirectionlist'];
    });
  }  

 

  Resetform() {
    this.merchentForm.reset({
      MerchantAttribute: '',
      MerchantValue: '',
      MerchantDescription: '',
      Merchanturl: ''
    })
  }

}
