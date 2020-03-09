import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Checkout3DSComponent } from './checkout3-ds.component';

describe('Checkout3DSComponent', () => {
  let component: Checkout3DSComponent;
  let fixture: ComponentFixture<Checkout3DSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Checkout3DSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Checkout3DSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
