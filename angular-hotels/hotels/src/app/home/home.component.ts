import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { HotelService } from '../hotel.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tittle = 'Cadeia de hoteis';

  info;
  hotels;
  displayingImages = [];

  constructor(
    private hotelService: HotelService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    console.log(new Date());
    this.getListOfHotels();
  }

  getListOfHotels() {
    this.hotelService.getHotels()
        .subscribe(info => {
          console.log(info);
          this.info = info;
          this.tittle = this.info.title;
          this.hotels = this.info.hotel_list;

          // track only the first image of each hotel
          for (let i = 0; i < this.hotels.length; i++) {
            this.hotels[i].image = "./assets/images/" + this.hotels[i].image+ ".jpg";
          }
        });
  }

  private generateIndexBetweenZeroAnd(max) {
    return Math.floor(Math.random() * max);
  }

}
