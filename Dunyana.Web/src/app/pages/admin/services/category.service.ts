import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { category } from '../model/category';
import { DeletecategoryDto } from '../model/deletecategoryDto';
import { LocalStorageService } from 'angular-web-storage';
import { GetCategoryDto } from '../../customer/model/GetCategoryDto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  catgtype:string="A";
  categoryprioritylist:any[]=[];

  CategoryDto:GetCategoryDto={
    type:null,
    ipcountry:null
  }
  constructor(private http: HttpClient,public router:Router,private localstorage:LocalStorageService) { }

  public CategoryList(typecatg): Observable<any[]> {
    this.CategoryDto.type=typecatg;
    this.CategoryDto.ipcountry=this.localstorage.get("countryname");
    return this.http.post<any[]>(
      environment.API_URL + 'Category/GetCategories',this.CategoryDto
    );
  }

  public Insertcategorylist(categorylist:category[]): Observable<category[]> {
    return this.http.post<category[]>(environment.API_URL + 'Category/InsertCategories', categorylist);
  }

  public UpdateCategory(categorylist:category[]): Observable<category[]> {
    return this.http.post<category[]>(environment.API_URL + 'Category/UpdateCategories', categorylist);
  }
  public DeleteCategory(CategoryId:DeletecategoryDto): Observable<any> {
    return this.http.post<any>(environment.API_URL + 'Category/deleteCategory',CategoryId);
  }


  //banners

  public GetAllBanners(): Observable<any[]> {
    return this.http.get<any[]>(environment.API_URL + 'Banner/GetBanners/'+this.localstorage.get("countryname")+'/'+this.localstorage.get("Zone"));
  }
}
