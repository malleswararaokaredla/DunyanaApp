import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsPromotionsComponent } from './deals-promotions.component';

describe('DealsPromotionsComponent', () => {
  let component: DealsPromotionsComponent;
  let fixture: ComponentFixture<DealsPromotionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsPromotionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
