import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegistrationDto } from '../model/DTOs/RegistraionDto';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { LocalStorageService } from 'angular-web-storage';
import { InsertCustomerRegistrationDto } from '../model/DTOs/InsertCustomerRegistrationDto';
import { MobileOTPDto } from '../model/DTOs/MobileOTPDto';
@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {

  constructor(private http: HttpClient, public router: Router, private localStorage: LocalStorageService) { }

  public test(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'lookup');
  }

  public CustomerRegistration(registration: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/InsertCustomer', registration);
  }

  public SendOTP(registration: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/OTPAuthentication', registration);
  }

  public InsertCustomer(registration: InsertCustomerRegistrationDto): Observable<InsertCustomerRegistrationDto> {
    return this.http.post<InsertCustomerRegistrationDto>(environment.API_URL + 'Customer/InsertCustomer', registration);
  }

  public EmailVerificationUpdate(registration: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/AccountActivation', registration);
  }

  public EmailVerification(registration: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/EmailCheckValidation', registration);
  }

  public MobileVerification(registration: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/MobileCheckValidation', registration);
  }

  public MobileOTPAuthentication(registration: MobileOTPDto): Observable<MobileOTPDto> {
    return this.http.post<MobileOTPDto>(environment.API_URL + 'Customer/MobileOTPAuthentication', registration);
  }

  public ChangePassword(changepassword: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/ChangePassword', changepassword);
  }

  public GetProfileInformation(registration: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/GetProfileDetails', registration);
  }

  public UpdateCustomerProfileData(profiledata: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/UpdateCustomer', profiledata);
  }

  public GetCountriesList(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'LookupTypeValue/GetCountrylist');
  }

  public GetTermsandConditions(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'TermsandConditions/TermsandConditions');
  }


  async storeData(data) {
    this.localStorage.set('userData', JSON.stringify(data));
    const newData = await this.getData();
    return this.router.navigate(['/Home'], newData);
  }

  getData() {
    return JSON.parse(this.localStorage.get('userData'));
  }

  sessionIn() {
    let A;
    if (this.getData()) {
      A = this.router.navigate(['/Home'], this.getData());
    }
    return A;
  }

  sessionOut() {
    let A;
    if (!this.getData()) {
      A = this.router.navigate(['/Home']);
    }
    return A;
  }

  logOut() {
    localStorage.setItem('userData', '');
    localStorage.clear();
    return this.router.navigate(['/Home']);
  }

  Loginapi(login) {
    return this.http.post(environment.API_URL + 'Customer/' + 'UsersLoginAuthenticate', login, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
  registeruser(user: User): Observable<User> {
    const body: User = {
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      LoginType: user.LoginType,
      FBID: user.FBID,
      Image: user.Image,
      Address: user.Address,
      Mobile: user.Mobile,
      Country: user.Country,
      City: user.City,
      EmailVerified: user.EmailVerified,
      GoogleID: user.GoogleID,
      PWD: user.PWD,
      Type: user.Type,
      token: user.token
    }

    var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post<User>(environment.API_URL + 'CustomerRegistration/' + 'InsertRegistrationDetails', body, { headers: reqHeader });
  }


  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders();
      this.http.post(environment.API_URL + type, JSON.stringify(credentials), { headers: headers })
        .subscribe(res => {
        }, (err) => {
          reject(err);
        });
    });
  }
  login(user: User) {
    var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post<User>(environment.API_URL + 'Customer/' + 'UsersLoginAuthenticate', user, { headers: reqHeader });
  }

  forget(user: User) {
    var reqHeader = new HttpHeaders({ 'No-Auth': 'True' });
    return this.http.post<User>(environment.API_URL + 'CustomerRegistration/' + 'ForgotPassword', user, { headers: reqHeader });
  }
  public sendingotp(registration: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/OTPAuthentication', registration);
  }

  public newpwd(registration: RegistrationDto): Observable<RegistrationDto> {
    return this.http.post<RegistrationDto>(environment.API_URL + 'Customer/ChangePassword', registration);
  }

  public GetUserPointsHistory(customerId: any): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'WalletPoints/GetWalletPointsHistory/'+customerId);
  }

}
