import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallethistoryComponent } from './wallethistory.component';

describe('WallethistoryComponent', () => {
  let component: WallethistoryComponent;
  let fixture: ComponentFixture<WallethistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallethistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
