import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { category } from '../model/category';
import { DeletecategoryDto } from '../model/deletecategoryDto';
import { InsetMerchantCatalogDto } from '../model/InsetMerchantCatalogDto';
import { UpdateMerchantCatalogDto } from '../model/UpdateMerchantCatalogDto';
import { DeleteMerchantCatalogDto } from '../model/DeleteMerchantCatalogDto';

@Injectable({
  providedIn: 'root'
})
export class MerchantCatalogService {

  constructor(private http: HttpClient,public router:Router) { }

  public Getmerchantswithcategories(): Observable<any> {
    return this.http.get<any>(environment.API_URL + 'MerchantCatalog/getMerchantCataloglist');
  }

  public Cataloglistbymerchant(Merchantid): Observable<any[]> {
    return this.http.get<any[]>(
      environment.API_URL + 'MerchantCatalog/getMerchantCatalog/'+Merchantid
    );
  }

  public Insertcatalog(catalog:InsetMerchantCatalogDto): Observable<InsetMerchantCatalogDto> {
    return this.http.post<InsetMerchantCatalogDto>(environment.API_URL + 'MerchantCatalog/insertMerchantCatalog', catalog);
  }

  public UpdateCatalog(catalog:UpdateMerchantCatalogDto): Observable<UpdateMerchantCatalogDto> {
    return this.http.post<UpdateMerchantCatalogDto>(environment.API_URL + 'MerchantCatalog/updateMerchantCatalog', catalog);
  }
  public DeleteCatalogy(catalog:DeleteMerchantCatalogDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'MerchantCatalog/deleteMerchantCatalog',catalog);
  }

}
