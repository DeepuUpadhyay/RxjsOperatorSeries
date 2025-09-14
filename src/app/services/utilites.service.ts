import { Injectable } from '@angular/core';
import { AsyncSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilitesService {
 exclusive= new Subject<boolean>();
 userNames= new Subject<string>();
 videoEmit= new ReplaySubject<string>(5,3000);
 asyncVideoEmit= new AsyncSubject<string>();
  constructor() { }
  print(val:any,containerId:string){
    let li= document.createElement('li');
    li.className='list-group-item';
    li.innerText=val
    let el= document.getElementById(containerId);
    el?.appendChild(li);

   }
}
