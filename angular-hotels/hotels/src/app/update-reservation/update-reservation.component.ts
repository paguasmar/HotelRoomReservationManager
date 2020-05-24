import { Component, OnInit } from '@angular/core';
import { UserSpaceService } from '../user-space.service';
import { RoomTypeService } from '../room-type.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BookService } from '../book.service';

@Component({
  selector: 'app-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.css']
})
export class UpdateReservationComponent implements OnInit {

  constructor(private service: UserSpaceService, private room_type_service: RoomTypeService,
    private router: Router,
    private datePipe: DatePipe, private bookService: BookService) { }

  reservation;
  price;
  confirmationFase;

  ngOnInit() {
    this.reservation = this.service.getReservation();
    this.reservation.begin_date = this.datePipe.transform(this.reservation.begin_date,'yyyy-MM-dd');
    this.reservation.end_date = this.datePipe.transform(this.reservation.end_date,'yyyy-MM-dd');
    this.price = this.reservation.price;
    this.confirmationFase = false;
  }

  calculateNewPrice(){
    let beginDate = new Date(this.reservation.begin_date);
    let endDate = new Date(this.reservation.end_date);
    if(beginDate >= endDate)
      alert("A data de inicio da reserva tem de ser superior à data final!");
    else if(beginDate <= new Date())
      alert("A data de inicio da reserva tem de ser depois da data de hoje!");
    else
      this.price = this.room_type_service.getPrice(this.reservation.room_type,beginDate,endDate); 
  }

  move(res){
    this.confirmationFase = res;
  }

  book(){
    if(confirm("Tem a certeza que pretende atualizar a reserva?")){
      let beginDate = new Date(this.reservation.begin_date);
      let endDate = new Date(this.reservation.end_date);
      if(beginDate >= endDate)
        alert("A data de inicio da reserva tem de ser superior à data final!");
      else if(beginDate <= new Date())
        alert("A data de inicio da reserva tem de ser depois da data de hoje!");
      else{
        this.bookService.updateReservation(this.reservation._id,this.reservation.begin_date,
          this.reservation.end_date,this.reservation.card_number,this.reservation.expiration_date,
          this.reservation.cvv,this.price).subscribe(r => {
          let info :any = r;
          if(info.result)
            alert("Reserva feita atualizada com sucesso!");
          else
            alert("Não foi possivel reservar este quarto.");
      
          //this.router.navigateByUrl("user home page");   
          this.router.navigateByUrl("/home");   
      });
    }
    }
  }
}