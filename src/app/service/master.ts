import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getlocation, searchbuses } from '../mock_data';

@Injectable({
  providedIn: 'root',
})
export class Master {
    


  constructor(private http:HttpClient){}

   getLocations() {
    return getlocation; 
  }


searchBus(fromId: number, toId: number, date: string) {
  return searchbuses.filter(bus =>
    bus.fromLocationId === +fromId &&   
    bus.toLocationId === +toId &&
    bus.travelDate === date
  );
}

getbusbyid(id: number) {
  console.log('Searching for ID:', id);
  console.log('Available buses:', searchbuses);
  return searchbuses.find(bus => bus.busId === Number(id)); 
}
getBookedseats(id:number){
  return searchbuses.find(bus=>bus.busId===id)

}

}
