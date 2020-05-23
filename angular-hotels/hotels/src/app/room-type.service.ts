import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { getRoomsUrl, getRoomsAtUrl,getIsRoomTypeFreeUrl } from './routingPaths';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {

 // para ser usado da passagem da página room-types para book-room
  private dataSource = new BehaviorSubject<any>(null);

  setCurrentTransientState(room_type,room_types,beginDate,endDate){
    let data = {
      room_type: room_type,
      room_types: room_types,
      beginDate: beginDate,
      endDate: endDate
    }

    this.dataSource.next(data);
  }

  getCurrentTransientState(){
    return this.dataSource.getValue();
  }

  constructor(private http: HttpClient) { }

  getRooms(id: string){
      return this.http.get<JSON>(getRoomsUrl(id));
  }

  async getRoomsAt(id: string, beginDate, endDate){
    let rooms: any;
    let res: any = [];
    await this.getRooms(id).toPromise().then(r => rooms = (r as any).room_type_list);
    console.log(rooms);
    for(let i = 0; i < rooms.length; i++){
      if(await this.isRoomTypeAvailable(rooms[i]._id,beginDate,endDate)){
        console.log("a");
        res.push(rooms[i]);
      }
    }
    return res;
  }

  private async isRoomTypeAvailable(id,beginDate,endDate){
    let res: Boolean;
    console.log(getIsRoomTypeFreeUrl(id,beginDate,endDate));
    await this.http.get(getIsRoomTypeFreeUrl(id,beginDate,endDate)).toPromise().then(r => res = (r as any).result);
    return res;
  }

  getPrice(room_type,beginDate,endDate){
    let total = 0;
    let currentDate = new Date(beginDate);
    
    while(currentDate <= endDate){
      total += this.isDateEpocaBaixa(currentDate) ? room_type.price_low_epoch : room_type.price_high_epoch;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
     return total;
  }

  // verifica se eh epoca baixa
  //A época baixa decorre desde 15 de janeiro a 31 e maio e desde 30 de setembro a 15 de dezembro
  //A época alta decorre desde 1 de junho a 29 de Setembto e desde 16 de dezembro a 14 de janeiro
  private isDateEpocaBaixa(date) {
    let low_min1 = new Date(2020,0,15);
    let low_max1 = new Date(2020,4,31);
    let low_min2 = new Date(2020,8,30);
    let low_max2 = new Date(2020,11,15);
    let currentDate = new Date(2020,date.getMonth(),date.getDate());
    return currentDate >= low_min1 && currentDate <= low_max1 || currentDate >= low_min2 && currentDate <= low_max2;
  }
}
