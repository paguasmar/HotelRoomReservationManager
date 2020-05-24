import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { RoomTypeService } from '../room-type.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BookService } from '../book.service';


@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.css']
})
export class BookRoomComponent implements OnInit {

  hotel;
  room_type;
  room_types;
  beginDate;
  endDate;
  price;
  
  info;

  bookRoomForm = new FormGroup({
    room: new FormControl(""),
    beginDate: new FormControl(""),
    endDate: new FormControl(""),
    name: new FormControl(""),
    email: new FormControl(""),
    address: new FormControl(""),
    telephone: new FormControl('', [Validators.min(100000000), Validators.max(999999999)]),
    nif: new FormControl(""),
    cardNumber: new FormControl(""),
    code: new FormControl(""),
    cvv: new FormControl(""),
    validade: new FormControl("")
  });

  constructor(
    private service: RoomTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private bookingService: BookService 
  ) { }

  ngOnInit() {
    this.getData();
  }

  private getData(){
    let transientState = this.service.getCurrentTransientState();
    this.room_type = transientState.room_type;
    this.room_types = transientState.room_types;
    this.hotel = transientState.room_type.hotel;
    this.beginDate = transientState.beginDate;
    this.endDate = transientState.endDate;
    this.price = this.service.getPrice(this.room_type,this.beginDate,this.endDate);
    this.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
    this.beginDate = this.datePipe.transform(this.beginDate, 'yyyy-MM-dd');
  }


  onSubmit(info){
    console.log("Redirecting: ");
    console.log(info);
    //check if all the info is alright
    if(new Date(info.beginDate) > new Date(info.endDate))
      alert("O periodo de datas tem de ser válido");
    else if(info.beginDate <= new Date())
      alert("A data de inicio tem de ser depois de hoje");
    else if(info.name == "")
      alert("O campo nome não pode estar vazio");
    else if(info.email == "")
      alert("O campo e mail não pode estar vazio");
    else if(!info.email.includes("@")) //se quiserem podem fazer regex eu tiver perguiça
      alert("O email inserido não é válido");
    else if(info.cardNumber < 1000000000000000 || info.cardNumber > 9999999999999999)
      alert("O número do cartão de multibanco não é válido");
    else if(info.telephone.toString().length < 9)
      alert("O número de telefone não é válido")
    else if(!this.validateNIF(info.nif))
      alert("O nif não é válido")
    else if(info.address == "")
      alert("A morada não pode estar vazia");
    else if(info.cvv < 100 || info.cvv > 999)
      alert("O cvv não é válido");
    else{
      this.bookingService.setData(info.name,info.room,this.price,info.beginDate,info.endDate, info.email,
        info.cardNumber, info.code + "" + info.telephone,info.address,info.nif,info.cvv,info.validade);
      this.router.navigateByUrl("hotel/room_type/book/confirm");
    }
  }

  //cortesia da wikipedia lmao
  validateNIF(value) {
    const nif = typeof value === 'string' ? value : value.toString();
    const validationSets = {
      one: ['1', '2', '3', '5', '6', '8'],
      two: ['45', '70', '71', '72', '74', '75', '77', '79', '90', '91', '98', '99']
    };

    if (nif.length !== 9) {
     return false;
    }

    if (!validationSets.one.includes(nif.substr(0, 1)) && !validationSets.two.includes(nif.substr(0, 2))) {
      return false;
    }

    const total = nif[0] * 9 + nif[1] * 8 + nif[2] * 7 + nif[3] * 6 + nif[4] * 5 + nif[5] * 4 + nif[6] * 3 + nif[7] * 2;
    const modulo11 = (Number(total) % 11);

    const checkDigit = modulo11 < 2 ? 0 : 11 - modulo11;

    return checkDigit === Number(nif[8]);
  }

  calculateNewPrice(){
    this.price = this.service.getPrice(this.room_type,new Date(this.beginDate),new Date(this.endDate));
  }
}
