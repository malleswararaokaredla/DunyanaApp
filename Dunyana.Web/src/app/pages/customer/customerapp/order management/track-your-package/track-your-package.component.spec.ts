import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackYourPackageComponent } from './track-your-package.component';

describe('TrackYourPackageComponent', () => {
  let component: TrackYourPackageComponent;
  let fixture: ComponentFixture<TrackYourPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackYourPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackYourPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
