import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletpointsComponent } from './walletpoints.component';

describe('WalletpointsComponent', () => {
  let component: WalletpointsComponent;
  let fixture: ComponentFixture<WalletpointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletpointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
