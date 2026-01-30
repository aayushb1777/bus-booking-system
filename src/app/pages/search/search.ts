import { Component ,inject,OnInit,signal} from '@angular/core';
import { Master } from '../../service/master';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-search',
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit{
  searchobj:any={
    fromloc:'',
    toloc:'',
    traveldate:''
  }
  buslist:any
   loc = signal<any[]>([]);
  busfiltered = signal<any[]>([]); 

    constructor(private master:Master) {
 
    }
    ngOnInit():void{

     this.loc.set(this.master.getLocations());
      
      
    }
    onSearch() {
  const { fromloc, toloc, traveldate } = this.searchobj;

  const result = this.master.searchBus(fromloc, toloc, traveldate);
console.log(result)
      this.busfiltered.set(result)
  console.log(this.busfiltered()); 
}

      }

