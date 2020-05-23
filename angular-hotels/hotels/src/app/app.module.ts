import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { RoomTypesComponent } from './room-types/room-types.component';
import { BookRoomComponent } from './book-room/book-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomTypeService } from './room-type.service';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { BookService } from './book.service';
import { UserSpaceComponent } from './user-space/user-space.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HotelDetailsComponent,
    RoomTypesComponent,
    BookRoomComponent,
    BookingConfirmationComponent,
    UserSpaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [RoomTypeService,BookService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
