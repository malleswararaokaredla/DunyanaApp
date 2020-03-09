import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaqelFinanceTeamComponent } from './naqel-finance-team.component';

describe('NaqelFinanceTeamComponent', () => {
  let component: NaqelFinanceTeamComponent;
  let fixture: ComponentFixture<NaqelFinanceTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaqelFinanceTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaqelFinanceTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
