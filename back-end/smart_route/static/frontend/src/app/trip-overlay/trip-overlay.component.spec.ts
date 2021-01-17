import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripOverlayComponent } from './trip-overlay.component';

describe('TripOverlayComponent', () => {
  let component: TripOverlayComponent;
  let fixture: ComponentFixture<TripOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
