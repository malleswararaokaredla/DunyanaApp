import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { CustomerappComponent } from './pages/customer/customerapp/customerapp.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SessionTimeOutComponent } from './session-time-out/session-time-out.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

const routes: Routes = [

  {
    path: "",
    component: CustomerappComponent
  },
  {
    path: "error",
    component: PageNotFoundComponent
  },
  {
    path: "session-timeout",
    component: SessionTimeOutComponent
  },
  {
    path: "terms-and-conditions",
    component: TermsAndConditionsComponent
  },
  {
    path: "privacy-policy",
    component: PrivacyPolicyComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }),
    //RouterModule.forRoot(routes,{useHash:true})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {

    this.router.errorHandler = (error: any) => {
      console.log(error);
      let routerError = error.toString();
      if (routerError.indexOf('Cannot match any routes') >= 0) {
        this.router.navigate(['/error']);
      } else {
        throw error;
      }
    }
  }
}