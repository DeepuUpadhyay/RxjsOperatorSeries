import { Component, OnInit } from '@angular/core';
import { Subscription, from, interval, of, take, toArray } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-to-array',
  templateUrl: './to-array.component.html',
  styleUrls: ['./to-array.component.css'],
})
export class ToArrayComponent implements OnInit {
  items: any = [];
  constructor(private utility: UtilitesService) {}
  sourceSubscription?: Subscription;
  ngOnInit() {
    // toArray operator- It will convert the observable data into an array.
    const source = interval(1000);
    this.sourceSubscription = source
      .pipe(take(5), toArray())
      .subscribe((val: any) => {
        console.log(val);
        // this.items = val;
        // console.log(this.items);
      });
    const source2 = of('Apple', 'Orange', 'Grapes');
    source2.pipe(take(2), toArray()).subscribe((val) => {
      // console.log(val);
    });
    let userData = [
      { id: 1, name: 'Anil', city: 'Pune' },
      { id: 2, name: 'Sunil', city: 'Mumbai' },
      { id: 3, name: 'Rahul', city: 'Delhi' },
    ];
    const source3 = from(userData);
    source3.subscribe((val) => {
      this.items.push(val);
      console.log(this.items );
    });
  }
}

