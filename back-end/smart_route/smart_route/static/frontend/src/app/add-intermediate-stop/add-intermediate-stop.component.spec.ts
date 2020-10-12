import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntermediateStopComponent } from './add-intermediate-stop.component';

describe('AddIntermediateStopComponent', () => {
  let component: AddIntermediateStopComponent;
  let fixture: ComponentFixture<AddIntermediateStopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIntermediateStopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIntermediateStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
