import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { getUserReservationsUrl } from './routingPaths';

@Injectable({
  providedIn: 'root'
})
export class UserSpaceService {

  constructor(private http: HttpClient) { }

  getUserPage(email) {
    return this.http.get<JSON>(getUserReservationsUrl(email));
  }

}
