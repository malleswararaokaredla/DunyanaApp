import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMerchantCatalogComponent } from './add-merchant-catalog.component';

describe('AddMerchantCatalogComponent', () => {
  let component: AddMerchantCatalogComponent;
  let fixture: ComponentFixture<AddMerchantCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMerchantCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMerchantCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
