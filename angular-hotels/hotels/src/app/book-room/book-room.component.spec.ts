import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookRoomComponent } from './book-room.component';

describe('BookRoomComponent', () => {
  let component: BookRoomComponent;
  let fixture: ComponentFixture<BookRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
