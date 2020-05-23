import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { RoomTypeService } from '../room-type.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.css']
})
export class RoomTypesComponent implements OnInit {

  info;
  name;
  room_types;
  room_types_display;
  num_rooms;
  selected = [];
  standard_services_list;

  @ViewChildren('allServices') services;
  constructor(private service: RoomTypeService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getAllRooms();
  }

  ngAfterViewInit(){
    this.services.changes.subscribe(t => {
      //depois do render do ngfor
      let standard_services = new Map<string,string>();
      for(let i = 0; i < this.standard_services_list.length; i++){
        standard_services.set(this.standard_services_list[i]._id, this.standard_services_list[i].name);
      }
      this.distinguishNonStandardServices(standard_services);
    })
  }

  getAllRooms() {
    this.service.getRooms(this.route.snapshot.paramMap.get('id')).subscribe(t => {
      this.info = t;
     
      this.room_types = this.info.room_type_list;
      this.name = this.room_types[0].hotel.name;
      this.room_types_display = this.room_types;
      this.num_rooms = this.room_types.length;
      // this.markEqualServices(this.room_types);
      this.standard_services_list = this.info.standard_services;

    });
  }

  distinguishNonStandardServices(standard_services){
      for(let i  = 0; i < this.room_types_display.length; i++){
        for(let j = 0; j < this.room_types_display[i].services.length; j++){
        let service = this.room_types_display[i].services[j];
          if(standard_services.get(service._id) == undefined){
            document.getElementById(service._id + this.room_types_display[i]._id).classList.add("unique-service");
          }
        }
      }
    
  }

  // calcula o preço de uma reserva no quarto de uma data ate outra
  // temos de percorrer os dias para saber quais sao os de epoca alta
  // e quais os de epoca baixa pois o intervalo pode apanha ambas
  calcPriceForRoom(room) {
    let beginDateValue = (document.getElementById("inicio")as HTMLInputElement).value;
    let endDateValue = (document.getElementById("fim")as HTMLInputElement).value;

    if(beginDateValue == "" || endDateValue == "")
      return "-";
    let beginDate = new Date(beginDateValue)
    let endDate = new Date(endDateValue);
    return this.service.getPrice(room,beginDate,endDate);
   }

   async filter(){
    await this.filterDate();
    this.filterPrice();
   }

  //associar ao botão
  filterPrice(): void{
    //a época baixa decorre desde 15 de janeiro a 31 e maio e
    // desde 30 de setembro a 15 de dezembro; a época alta decorre durante o resto do ano
    let minPrice :any= (document.getElementById("baixa") as HTMLInputElement).value;
    if(minPrice == "")
      minPrice = Number.MIN_VALUE;
    let maxPrice :any= (document.getElementById("alta")  as HTMLInputElement).value;
    if(maxPrice == "")
      maxPrice = Number.MAX_VALUE;  
    var types = [];
    for(let i = 0; i < this.room_types_display.length; i++){
      let highSeasonPrice = this.room_types_display[i].price_high_epoch;
      let lowSeasonPrice = this.room_types_display[i].price_low_epoch;
      if(highSeasonPrice >= minPrice && highSeasonPrice <= maxPrice || 
              lowSeasonPrice >= minPrice && lowSeasonPrice <= maxPrice )
        types.push(this.room_types_display[i]);
    }
    this.room_types_display = types;
    // this.markEqualServices(this.room_types_display);
  }

  async filterDate(){
    let beginDate = (document.getElementById("inicio")as HTMLInputElement).value;
    let endDate = (document.getElementById("fim") as HTMLInputElement).value;
    if(endDate < beginDate){
      alert('A data de fim tem de ser depois da data de inicio');
      return;
    }
    this.room_types_display =  await this.service.getRoomsAt(this.route.snapshot.paramMap.get('id'),beginDate, endDate);
  }

  resetList(){
    (document.getElementById("baixa") as HTMLInputElement).value = "";
    (document.getElementById("alta")  as HTMLInputElement).value = "";
    this.room_types_display= this.room_types;
  }

  add(room_type){   
    let index = this.selected.indexOf(room_type,0);
    if(index > -1){
      this.selected.splice(index,1);
      document.getElementById(room_type.name).classList.remove("tipo-de-quarto-selected");
      document.getElementById(room_type.name).classList.add("tipo-de-quarto-non-selected");
    }else{
      this.selected.push(room_type);
      document.getElementById(room_type.name).classList.add("tipo-de-quarto-selected");
      document.getElementById(room_type.name).classList.remove("tipo-de-quarto-non-selected");
    }
  }

  compare(){
    this.room_types_display = this.selected;
    for(let i = 0; i < this.selected.length; i++){
      document.getElementById(this.selected[i].name).classList.remove("tipo-de-quarto-selected");
      document.getElementById(this.selected[i].name).classList.add("tipo-de-quarto-non-selected");
    }
    this.selected = [];
  }

  bookRedirect(room_type){
    let beginDateValue = (document.getElementById("inicio")as HTMLInputElement).value;
    let endDateValue = (document.getElementById("fim")as HTMLInputElement).value;

    if(beginDateValue == "" || endDateValue == ""){
      alert("Têm de ser inseridas dadas de pesquisa");
      return;
    }
    let beginDate = new Date(beginDateValue)
    let endDate = new Date(endDateValue);
    if(endDate < beginDate){
      alert('A data de fim tem de ser depois da data de inicio');
      return;
    }
    this.service.setCurrentTransientState(room_type,this.room_types_display,beginDate,endDate);
    //console.log(this.service.getCurrentTransientState());
    this.router.navigateByUrl("hotel/room_type/book");
  }
}
