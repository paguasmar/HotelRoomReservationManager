import { Component, OnInit, Input, Output } from '@angular/core';
import { BookService } from '../book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {

  private info;

  constructor(private service: BookService,private router: Router) { }

  ngOnInit() {
    this.info = this.service.getInfo();
  }

  cancel(){
    if(confirm("Estarác prestes a cancelar  reserva e irá ser redirecionado para a página do hotel, tem a certeza que o pretende fazer?")){
      this.router.navigateByUrl("/hotel/"+this.info.room_type.hotel._id);
    }
  }

  book(){
    if(confirm("Tem a certeza que pretende confirmar a reserva?")){
      this.service.createReservation().subscribe(r => {
        let info :any = r;
        console.log(info);
        if(info.result)
          alert("Reserva feita com sucesso!");
        else
          alert("Não foi possivel reservar este quarto.");
     
        //this.router.navigateByUrl("user home page");   
        this.router.navigateByUrl("/hotel/" + this.info.room_type.hotel._id + "/room_types");   
      });
    }
  }
  
}
