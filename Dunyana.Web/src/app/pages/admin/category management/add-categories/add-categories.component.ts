import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { category } from '../../model/category';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CategoryService } from '../../services/category.service';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from 'angular-web-storage';


@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.scss']
})
export class AddCategoriesComponent implements OnInit {

  @Input() display: boolean;
  @Input() childMessage: any[];

  
  @Output() displayChange = new EventEmitter();

  categoryForm: FormGroup;
  categorystatus: any[] = [];
  categorypriority: any[] = [];
  btndisable: string = "disable";
  response: string = "";
  responsesty: string = "";
  namepattern: string = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';
  savebtndisable: string = "disable";
  imageChangedEvent: any = '';
  croppedImage: any = '';
  finalImage: any = '';
  categorylist: any[] = [];
  categorieslist: Array<any> = [];
  catgegorydto: category = {
    Id: 0,
    Name: null,
    Image: null,
    Priority: 0,
    IsActive: null
  }
  constructor(private fb: FormBuilder, private catgservice: CategoryService, private localStorage: LocalStorageService) {
  }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      Name: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      Priority: ['Select Priority'],
      IsActive: ['Select Status'],
    });

    this.categorystatus = [
      { label: 'Active', value: '1' },
      { label: 'In Active', value: '0' }
    ];

    // for (var i = 1; i <= 100; i++) {
    //   this.categorypriority.push({ label: i.toString(), value: i.toString() });
    this.categoryForm.controls['IsActive'].setValue(this.categorystatus[0]["value"]);
    //this.categoryForm.controls['Priority'].setValue(this.categorypriority[0]["value"], { onlySelf: true });
    this.GetCategoryList();

  }

  get category() {
    return this.categoryForm.get('category') as FormArray;
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
    if (this.categoryForm.valid) {
      this.btndisable = "line_btn sblue mr-4";
    }
    else {
      this.btndisable = "disable";
    }
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

  onClose() {
    this.GetCategoryList();
    this.displayChange.emit(false);
    this.response = "";
    this.RestForm();
    this.btndisable = "disable";
    this.categoryForm.controls['Priority'].setValue(this.categorypriority[0]["value"], { onlySelf: true });
    this.categoryForm.controls['IsActive'].setValue(this.categorystatus[0]["value"]);
  }
  redirectcustomerlist() {
    this.response = "";
    this.displayChange.emit(false);
    //this.RestForm();
  }

  AddCategory() {
    if (this.finalImage === null || this.finalImage === "") {
      this.response = "Please upload image";
      this.responsesty = "errormsg";
    }
    else {
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
            this.redirectcustomerlist();
            this.RestForm();
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
          }, 2000);
        });
    }
  }

  RestForm() {
    this.categoryForm.reset({
      'Name': ''
    });
    this.finalImage = "";
  }

  GetCategoryList() {
    let typecatg = "A";
    this.catgservice.CategoryList(typecatg).subscribe(res => {
      res.forEach(catgrow => {
        if (catgrow["isActive"] === 1) {
          catgrow["isActive"] = "Active";
        }
        else if (catgrow["isActive"] === 0) {
          catgrow["isActive"] = "In Active";
        }
      })
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

      // this.categorylist = this.categorylist.sort((val1, val2) => { return val1.priority - val2.priority });
      this.categorypriority = jsonArray;
      this.categoryForm.controls['Priority'].setValue(this.categorypriority[0]["value"], { onlySelf: true });
    });
  }
}
