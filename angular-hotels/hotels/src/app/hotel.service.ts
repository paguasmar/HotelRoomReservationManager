import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { getHotelUrl, HOTELS} from './routingPaths';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  constructor(private http: HttpClient) { }

  getHotel(id: String){
    return this.http.get<JSON>(getHotelUrl(id));
  }

  getHotels() {
    return this.http.get<JSON>(HOTELS);
  }
  
}
