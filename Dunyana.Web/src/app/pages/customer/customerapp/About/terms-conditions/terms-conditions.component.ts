import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { UsermanagementService } from '../../../services/usermanagement.service';
import { DomSanitizer} from '@angular/platform-browser';



@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {

  @Input() isChecked = null;

  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();
  ProgressSpinnerDlg:boolean=false;
  reportUrl: string;
  hostUrl: string = 'http://localhost:4200/';

tdoc:string="";
  constructor(private tearms:UsermanagementService,public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.ProgressSpinnerDlg=true;
    this.tearms.GetTermsandConditions().subscribe(res=>{
      this.ProgressSpinnerDlg=false;
      this.tdoc=res["result"];
      this.reportUrl=res["result"];
    });
   // this.scrollToId();

  }
  onClose() {
    this.display = false;
    this.displayChange.emit(false);
  }

  GetUrl()
  {
    return this.sanitizer.bypassSecurityTrustResourceUrl("assets/Contract_Files/2019/Oct/Cust_TnC.docx");
  }

  IsAcceptterms() {
    this.isChecked = true;
    this.display = false;
   // this.displayChange.emit(false);
  }

  scrollToId() {
    let el = document.getElementById('terms');
    el.scrollIntoView();
  }

}
