import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WallettopupComponent } from './wallettopup.component';

describe('WallettopupComponent', () => {
  let component: WallettopupComponent;
  let fixture: ComponentFixture<WallettopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallettopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallettopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
