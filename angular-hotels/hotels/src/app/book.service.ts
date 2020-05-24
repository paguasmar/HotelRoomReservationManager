import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { getBookingUrl,getReservationUpdateUrl } from './routingPaths';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {


  private dataSource = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  setData(name,room_type,price,begin_date,end_date,email,card_number,telephone, address,nif,cvv,validade){
    this.dataSource.next({
      name: name,
      room_type: room_type,
      price: price,
      begin_date: begin_date,
      end_date: end_date,
      email: email,
      card_number: card_number,
      telephone: telephone,
      address: address,
      nif: nif,
      cvv: cvv,
      validade: validade
    });
  }

  getInfo(){
    return this.dataSource.getValue();
  }

  createReservation(){
    let data = this.dataSource.getValue();
    return this.http.post(getBookingUrl(data.room_type._id),data);
  }

  updateReservation(id,begin_date,end_date,card_number,expiration_date,cvv,price){
    let data = this.getInfo();
    return this.http.post(getReservationUpdateUrl(),{
      id: id,
      begin_date: begin_date,
      end_date: end_date,
      card_number: card_number,
      expiration_date: expiration_date,
      cvv: cvv,
      price: price
    });
  }
}
