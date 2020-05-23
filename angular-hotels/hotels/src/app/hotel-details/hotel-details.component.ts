import { Component, OnInit } from '@angular/core';
import { HotelService } from '../hotel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {

  info;
  hotel;
  images;
  displayingImages = [];
  types : any[];
  index;

  constructor(private servive: HotelService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getHotel();
  }

  getHotel(): void{
    this.servive.getHotel(this.route.snapshot.paramMap.get('id')).subscribe(i =>{
      this.info = i;
      this.hotel = this.info.hotel;
      for(let i = 0; i < this.hotel.images.length; i++){
        this.hotel.images[i] = "./assets/images/" + this.hotel.images[i] + ".jpg";
      }
      this.images = this.hotel.images;
      this.index = this.images.length / 2;
      console.log(this.hotel._id);
      this.displayingImages.push(this.images[this.index - 1]);
      this.displayingImages.push(this.images[this.index]);
      this.displayingImages.push(this.images[this.index + 1]);     
    });
  }

  changeImage(mode: Boolean): void{
    //mode - false é left
    //mode - true é right
    //this.index = mode ? (this.index + 1)  % this.images.length : (this.index == 0 ? 1 : this.index - 1)  % this.images.length;
    if(mode){
      this.displayingImages[2] =  this.displayingImages[1];
      this.displayingImages[1] = this.displayingImages[0];
      this.index = (this.index + 1) %  this.images.length;
      this.displayingImages[0] = this.images[this.index];
    }
    if(!mode){
      this.displayingImages[0] = this.displayingImages[1];
      this.displayingImages[1] =  this.displayingImages[2];
      if(this.index == 0)  this.index = this.images.length - 1;
      else this.index = (this.index - 1) %  this.images.length;

      this.displayingImages[2] = this.images[this.index];
    }
    /*
    this.displayingImages[1] =  this.displayingImages[this.index];
    this.displayingImages[2] =  this.images[(this.index + 1) % this.images.length];
    this.displayingImages[0] = this.images[(this.index - 1) % this.images.length];;
    */
  
  }
}
