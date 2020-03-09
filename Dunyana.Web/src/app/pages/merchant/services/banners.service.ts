import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BannerDto } from '../modal/bannerDto';
import { UpdatebannerDto } from '../modal/UpdatebannerDto';
import { DeletebannerDto } from '../modal/DeletebannerDto';
import { MerchantBannerDto } from '../modal/MerchantBannerDto';

@Injectable({
  providedIn: 'root'
})
export class BannersService {
  constructor(private http: HttpClient, public router: Router) { }

  public GetbannersList(MerchantBanner:MerchantBannerDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Banner/GetBannersByMerchant' , MerchantBanner);
  }

  public Addbanner(banner:BannerDto): Observable<BannerDto> { 
    return this.http.post<BannerDto>(environment.API_URL + 'Banner/InsertBanners', banner);
  }
  public Updatebanner(banner:UpdatebannerDto): Observable<UpdatebannerDto> { 
    return this.http.post<UpdatebannerDto>(environment.API_URL + 'Banner/UpdateBanners', banner);
  }
  public Deletebanner(banner:DeletebannerDto): Observable<DeletebannerDto> { 
    return this.http.post<DeletebannerDto>(environment.API_URL + 'Banner/deleteBanners', banner);
  }
}