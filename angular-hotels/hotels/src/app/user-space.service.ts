import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { getUserReservationsUrl } from './routingPaths';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSpaceService {

  constructor(private http: HttpClient) { }

  private dataSource = new BehaviorSubject<any>(null);

  setReservation(reservation){
    this.dataSource.next(reservation);
  }

  getReservation(){
    return this.dataSource.getValue();
  }

  getUserPage(email) {
    return this.http.get<JSON>(getUserReservationsUrl(email));
  }

}
