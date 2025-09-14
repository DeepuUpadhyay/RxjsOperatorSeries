import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-custom-obserable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-obserable.component.html',
  styleUrls: ['./custom-obserable.component.css'],
})
export class CustomObserableComponent implements OnInit {
  constructor(private utility: UtilitesService) {}
  messageStatus = '';
  ngOnInit(): void {
    const customeObservable = Observable.create((observer: any) => {
      setTimeout(() => {
        observer.next('Angular');
      }, 1000);

      setTimeout(() => {
        observer.next('TypeScript');
      }, 2000);
      setTimeout(() => {
        observer.next('JavaScript');
      }, 3000);
      setTimeout(() => {
        observer.next('NodeJs');
        // observer.complete();
      }, 4000);

      setTimeout(() => {
        observer.next('MongoDB');
        observer.error(new Error('Limit Exceed'));
      }, 5000);
    });
    customeObservable.subscribe(
      (data: any) => {
        // console.log(data);
        this.utility.print(data, 'elContainer');
      },
      (error: any) => {
        this.messageStatus = 'error';
      },
      () => {
        this.messageStatus = 'completed';
      }
    );
    // Custome  Observable
    let arr = ['Angular', 'TypeScript', 'JavaScript', 'NodeJs', 'MongoDB'];
    const customeObservable2 = Observable.create((observer: any) => {
      let count = 0;
      setInterval(() => {
        if (count < arr.length) {
          observer.next(arr[count]);
          count++;
        } else {
          observer.complete();
        }
      }, 1000);
    });
    const customeObservableSubscription = customeObservable2.subscribe(
      (data: any) => {
        console.log(data);
        this.utility.print(data, 'elContainer2');
      }
    );
  }
}
