import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { RoomTypesComponent } from './room-types/room-types.component';
import { BookRoomComponent } from './book-room/book-room.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { UserSpaceComponent } from './user-space/user-space.component';
import { UpdateReservationComponent } from './update-reservation/update-reservation.component';

const routes: Routes = [ 
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'hotel/:id', component: HotelDetailsComponent },
  { path: 'hotel/:id/room_types', component: RoomTypesComponent },
  { path: 'hotel/room_type/book', component: BookRoomComponent },
  { path: 'hotel/room_type/book/confirm', component: BookingConfirmationComponent },
  { path: 'users', component: UserSpaceComponent }, 
  { path: 'users/reserva/editar', component: UpdateReservationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
