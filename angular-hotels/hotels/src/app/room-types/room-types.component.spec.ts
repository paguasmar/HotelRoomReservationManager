import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTypesComponent } from './room-types.component';

describe('RoomTypesComponent', () => {
  let component: RoomTypesComponent;
  let fixture: ComponentFixture<RoomTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
