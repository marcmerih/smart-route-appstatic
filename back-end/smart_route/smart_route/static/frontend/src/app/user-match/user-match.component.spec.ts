import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMatchComponent } from './user-match.component';

describe('UserMatchComponent', () => {
  let component: UserMatchComponent;
  let fixture: ComponentFixture<UserMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
