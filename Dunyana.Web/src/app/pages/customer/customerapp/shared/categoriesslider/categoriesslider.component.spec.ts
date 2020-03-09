import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriessliderComponent } from './categoriesslider.component';

describe('CategoriessliderComponent', () => {
  let component: CategoriessliderComponent;
  let fixture: ComponentFixture<CategoriessliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriessliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriessliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
