import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { category } from '../../model/category';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from 'angular-web-storage';
import { DeletecategoryDto } from '../../model/deletecategoryDto';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  display: boolean = false;
  imgdisplay: boolean = false;
  btndisable: string = "disable";
  editcatdisplay: boolean = false;
  savebtndisable: string = "disable";
  @Output() displayChange = new EventEmitter();
  ProgressSpinnerDlg:boolean=true;
  cols: any[];
  categorylist: any[] = [];
  updatecategorylist: any[] = [];
  categorystatus: any[] = [];
  categorypriority: any[] = [];
  response: string = "";
  responsesty: string = "";
  categoryForm: FormGroup;
  namepattern: string = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';
  categorieslist: Array<any> = [];

  finalImage: any = null;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  selectedcategory: any;
  parentMessage: any[] = [];
  name: boolean = true;
  isActive: boolean = true;
  dClose: boolean = false;
  submtbtn: string = "Update";
  catgegorydto: category = {
    Id: 0,
    Name: null,
    Image: null,
    Priority: 0,
    IsActive: null
  }
  deletecategoryDto: DeletecategoryDto = {
    CategoryId: 0
  }
  constructor(private catgservice: CategoryService, private router: Router, private fb: FormBuilder,
    private localStorage: LocalStorageService,
    private confirmationService: ConfirmationService) {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'image', header: 'Image' },
      { field: 'isActive', header: 'Status' },

    ];

    this.categorystatus = [
      { label: 'Active', value: '1' },
      { label: 'In Active', value: '0' }
    ];

  }

  ngOnInit() {

    this.GetCategoryList();
    this.categoryForm = this.fb.group({
      Id: ['', Validators.required],
      Name: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      Priority: ['Select Priority', Validators.required],
      IsActive: ['Select Status', Validators.required],
    });
  }

  formvalidate() {
    if (this.categoryForm.valid) {
      this.btndisable = "line_btn sblue mr-4";
    }
    else {
      this.btndisable = "disable";
    }
  }

  onDialogClose(event) {
    this.display = event;
    this.GetCategoryList();
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('noscroll');
  }
  onClose() {
    this.displayChange.emit(false);
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('noscroll');
    this.response = "";
    // this.GetCategoryList();
    this.categorylist.forEach(catgrow => {
      if (catgrow["isActive"] === 1) {
        catgrow["isActive"] = "Active";
      }
      else if (catgrow["isActive"] === 0) {
        catgrow["isActive"] = "In Active";
      }
    });

  }
  redirectcustomertable() {
    this.editcatdisplay = false;
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('noscroll');
  }

  fileChangeEvent(event: any): void {
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.finalImage = reader.result;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  saveCropImage() {
    this.finalImage = this.croppedImage;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  GetCategoryList() {
    this.ProgressSpinnerDlg=true;
    let typecatg = "A";
    this.catgservice.CategoryList(typecatg).subscribe(res => {
      res.forEach(catgrow => {
        if (catgrow["isActive"] === 1) {
          catgrow["isActive"] = "Active";
        }
        else if (catgrow["isActive"] === 0) {
          catgrow["isActive"] = "In Active";
        }
      });
      this.categorylist = res;

      let prtylist = [];
      this.categorylist.forEach(x => {
        prtylist.push(x["priority"]);
      });

      let prtylist2 = [];
      for (var i = 1; i <= 100; i++) {
        prtylist2.push(i);
      }

      let jsonArray = [];

      prtylist2.map(i => {
        if (prtylist.includes(i) === false) {
          jsonArray.push({ label: i.toString(), value: i.toString() });
        }
        else {
          jsonArray.push({ label: i.toString(), value: i.toString(), disabled: true });
        }
      });

      this.categorylist = this.categorylist.sort((val1, val2) => { return val1.priority - val2.priority });
      this.categorypriority = jsonArray;
      this.localStorage.set("catgprioritylist", jsonArray);
      this.parentMessage = this.localStorage.get("catgprioritylist");
      this.ProgressSpinnerDlg=false;

    });

  }

  Addcategories() {

    // this.display = true;
    // this.GetCategoryList();
    // let body = document.getElementsByTagName('body')[0];
    // body.classList.add('noscroll');

    this.editcatdisplay = true;
    this.submtbtn = "Add";
    this.ResetForm();
    this.categorystatus = [
      { label: 'Active', value: '1' },
      { label: 'In Active', value: '0' }
    ];

    this.categoryForm.controls["Id"].setValue(0);
    this.categoryForm.controls['IsActive'].setValue(this.categorystatus[0]["value"]);
    this.categoryForm.controls['Priority'].setValue(this.categorypriority[0]["value"], { onlySelf: true });

    this.formvalidate();

  }

  onRowSelect(event) {
    this.submtbtn = "Update";

    if (event.data["isActive"] === "Active") {
      event.data["isActive"] = 1;
    }
    else if (event.data["isActive"] === "In Active") {
      event.data["isActive"] = 0;
    }
    this.categoryForm.controls['Id'].setValue(event.data["id"]);
    this.categoryForm.controls['Name'].setValue(event.data["name"]);
    this.categoryForm.controls['Priority'].setValue(event.data["priority"].toString());
    this.categoryForm.controls['IsActive'].setValue(event.data["isActive"].toString());
    // this.finalImage = 'data:image/png;base64,' + event.data["image"];
    this.finalImage = event.data["image"];
    this.btndisable = "line_btn sblue mr-4";
    this.editcatdisplay = true;
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('noscroll');
  }

  updateCategory() {

    if (this.finalImage === null || this.finalImage === "") {
      this.response = "Please upload image";
      this.responsesty = "errormsg";
    }

    else {

      if (this.submtbtn === "Update") {
        this.updatecategorylist = [];
        this.catgegorydto.Id = this.categoryForm.value["Id"];
        this.catgegorydto.Name = this.categoryForm.value["Name"];
        this.catgegorydto.IsActive = parseInt(this.categoryForm.value["IsActive"]);
        this.catgegorydto.Priority = parseInt(this.categoryForm.value["Priority"]);
        this.catgegorydto.Image = this.finalImage.replace(/^data:image\/[a-z]+;base64,/, "");
        this.updatecategorylist.push(this.catgegorydto);
        this.catgservice.UpdateCategory(this.updatecategorylist).subscribe(res => {
          this.croppedImage = "";

          if (res["result"] === "Categories updated successfully.") {
            setTimeout(() => {
              this.redirectcustomertable();
              this.GetCategoryList();
              this.response = "";
              this.btndisable = "";
            }, 2000);
            this.response = res["result"];
            this.responsesty = "succsmsg";
            this.btndisable = "disable";

          }
          else {
            this.response = res["result"];
            this.responsesty = "errormsg";
            this.btndisable = "";
          }

        },
          error => {
            this.btndisable = "";
            this.response = "Some thing went wrong please try again";
            this.responsesty = "errormsg";
            setTimeout(() => {

              this.response = "";
            }, 5000);
          });
      }
      else if (this.submtbtn === "Add") {
        this.categorieslist.length = 0;
        this.catgegorydto.Name = this.categoryForm.value["Name"];
        this.catgegorydto.IsActive = parseInt(this.categoryForm.value["IsActive"]);
        this.catgegorydto.Priority = this.categoryForm.value["Priority"];
        this.catgegorydto.Image = this.finalImage.replace(/^data:image\/[a-z]+;base64,/, "");

        this.categorieslist.push(this.catgegorydto);
        this.catgservice.Insertcategorylist(this.categorieslist).subscribe(res => {

          this.croppedImage = "";
          if (res["result"] === "A new category is added successfully.") {
            setTimeout(() => {
              this.redirectcustomertable();
              this.GetCategoryList();
              this.ResetForm();
              this.response = "";
              this.btndisable = "";
            }, 2000);
            this.response = res["result"];
            this.responsesty = "succsmsg";
            this.btndisable = "disable";
          }
          else {
            this.response = res["result"];
            this.responsesty = "errormsg";
            this.btndisable = "";
          }
        },
          error => {
            this.response = "Something went wrong please try again";
            this.responsesty = "errormsg";
            setTimeout(() => {
              this.response = "";
            }, 5000);
          });
      }

    }

  }

  deleteCategory(event, id) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this category?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deletecategoryDto.CategoryId = Number.parseInt(id);
        this.catgservice.DeleteCategory(this.deletecategoryDto).subscribe(res => {
          this.GetCategoryList();
        },
          error => {
            this.response = error["error"]["result"];
            this.responsesty = "errormsg";
            setTimeout(() => {

              this.response = "";
            }, 3000);
          }
        );
      },
      reject: () => {

      }
    });
  }

  showfilter(col) {

    if (col === "name") {
      this.name = !this.name;
    } else if (col === "isActive") {
      this.isActive = !this.isActive;
    }
  }
  ResetForm() {
    this.categoryForm.reset({
      'Name': ''
    });
    this.finalImage = "";
  }


}
