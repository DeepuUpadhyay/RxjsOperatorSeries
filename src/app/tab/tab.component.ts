import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
})
export class TabComponent implements OnInit, OnDestroy{
  dataSubscribe!: Subscription;
  dataSubscribe2!: Subscription;
  myColor: string = '';
  source = interval(1000);
  arr = ['Angular', 'React', 'Vue', 'Node'];
  color = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'pink',
    'purple',
    'brown',
    'black',
    'white',
    'gray',
    'cyan',
    'magenta',
    'olive',
    'navy',
    'teal',
    'maroon',
    'fuchsia',
  ];
  constructor(private utility: UtilitesService) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.dataSubscribe = this.source
      .pipe(
        tap((data) => {
          if (data == 4) {
            this.dataSubscribe.unsubscribe();
          }
        }),
        map((data: any) => {
          return this.arr[data];
        })
      )
      .subscribe((data) => {
        this.utility.print(data, 'elContainer');
      });
    // Example-2 of the tap operator
    this.dataSubscribe2 = this.source
      .pipe(
        tap((data) => {
          console.log(data * 2);
        }),
        tap((data) => {
          if (this.color.length === data) {
            this.dataSubscribe2.unsubscribe();
          }
        }),
        map((data: any) => {
          return this.color[data];
        })
      )
      .subscribe((data) => {
        this.utility.print(data, 'elContainer2');
      });
  }
  ngDestroy() {
    this.dataSubscribe.unsubscribe();
    this.dataSubscribe2.unsubscribe();
  }
}
