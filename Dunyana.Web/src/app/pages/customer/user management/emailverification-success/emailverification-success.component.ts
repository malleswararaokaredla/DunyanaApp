import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistrationDto } from '../../model/DTOs/RegistraionDto';
import { UsermanagementService } from '../../services/usermanagement.service';

@Component({
  selector: 'app-emailverification-success',
  templateUrl: './emailverification-success.component.html',
  styleUrls: ['./emailverification-success.component.scss']
})
export class EmailverificationSuccessComponent implements OnInit {


  checkinfo:string="assets/layout/images/svg/success.svg";
  registerdto:RegistrationDto={
    Id:0,
    FirstName:null,
    LastName:null,
    Email:null,
    Mobile:null,
    Address:null,
    Country:null,
    City:null,
    Image:null,
    LoginType:null,
    FBID:null,
    GoogleID:null,
    oldPWD:null,
    PWD:null,
    Type:null,
    EmailVerified:0,
    Status:0,
  //  EncId:null,
   // NPWD:null,
    OTP:0
  }
 
  constructor( private route: ActivatedRoute,private userservice:UsermanagementService,private router: Router) { }

  ngOnInit() {
  //  console.log(this.route.snapshot.params['emailid']);
  //  this.registerdto.EncId=this.route.snapshot.params['emailid'];
  //  this.registerdto.EmailVerified=1;
  //  //this.registerdto.EncId="mVK1hxVmQALMG9qZR7wllw==";
  //  console.log(this.registerdto.EncId);
  //  this.userservice.EmailVerificationUpdate(this.registerdto).subscribe(res=>{
     
  //    localStorage.setItem("Email",res["reEmail"]);
  //   setTimeout(() => {
  //     this.router.navigate(['signin']);
  // }, 5000);  //5s
  //  });
  // }
}
}
