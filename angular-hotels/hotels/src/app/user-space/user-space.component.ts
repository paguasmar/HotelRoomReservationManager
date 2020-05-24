import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserSpaceService } from './../user-space.service';

@Component({
  selector: 'app-user-space',
  templateUrl: './user-space.component.html',
  styleUrls: ['./user-space.component.css']
})
export class UserSpaceComponent implements OnInit {

  title = "User & Reservations"

  info;
  // reservations of the user that provided the email
  currentUser;
  // reservations to display of the user that provided the email
  currentUserToDisplay;

  searchForm = new FormGroup({
    email: new FormControl("")
  });

  constructor(
    private service: UserSpaceService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
  }

  search(user) {
    this.service.getUserPage(user.email)
        .subscribe(r => {
          this.info = r;
          this.currentUser = this.info.reservation_list;
          this.currentUserToDisplay = this.currentUser;
          for(let i = 0; i < this.currentUserToDisplay.length; i++){
            this.currentUserToDisplay[i].begin_date = this.datePipe.transform(this.currentUserToDisplay[i].begin_date,'yyyy-MM-dd');
            this.currentUserToDisplay[i].end_date = this.datePipe.transform(this.currentUserToDisplay[i].end_date,'yyyy-MM-dd');
          }
        });
  }

  filter(){
    this.filterByDate();
    this.filterByPrice();
  }

  filterByPrice() {
    let minPrice :any= (document.getElementById("baixa") as HTMLInputElement).value;
    if(minPrice == "") // it wasn't given a min price so its not this filter
      return;

    let res = [];

    for(let i = 0; i < this.currentUserToDisplay.length; i++){
      let reservationPrice = this.currentUserToDisplay[i].price;
      if(reservationPrice > minPrice) // reservation price higher than given min value
        res.push(this.currentUserToDisplay[i]);
    }
    this.currentUserToDisplay = res;
  }

  // get the initial info to start filtering the elements to display
  filterByDate() {
    let beginDate = (document.getElementById("inicio")as HTMLInputElement).value;
    if(beginDate == "")
      return;

    let endDate = (document.getElementById("fim") as HTMLInputElement).value;
    if(endDate == "") { // exists beginDate but not endDate
      alert('Tem de fornecer data de inicio e de fim: Verificar Reserva entre datas');
      return;
    }

    if(endDate < beginDate){
      alert('A data de fim tem de ser depois da data de inicio');
      return;
    }

    this.filterBetweenDates(beginDate, endDate);
  }

  // filter the elements to display by dates
  filterBetweenDates(beginDate, endDate){

    let res = [];
    
    for (let i = 0; i < this.currentUser.length; i++) {
      let beginDateReserv = this.currentUser[i].begin_date;
      let endDateReserv = this.currentUser[i].end_date;
      if (beginDateReserv >= beginDate && endDateReserv <= endDate) {
        res.push(this.currentUser[i]);
      }
    }

    this.currentUserToDisplay = res;
  }

  resetList(){
    (document.getElementById("inicio") as HTMLInputElement).value = "";
    (document.getElementById("fim")  as HTMLInputElement).value = "";
    (document.getElementById("baixa") as HTMLInputElement).value = "";
    this.currentUserToDisplay = this.currentUser;
  }

  cancel() {
    this.redirectToRooms();
  }

  redirectToRooms() {
    this.router.navigateByUrl("/home");
  }

  isFutureReservation(reservation){
    let begin_date = new Date(reservation.begin_date);
    let now = new Date();
    return begin_date > now;
  }

  redirectEditReservation(reservation){
    this.service.setReservation(reservation);
    this.router.navigateByUrl("users/reserva/editar");
  }

}
