import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { delay, from, of, tap } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-of-from',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './of-from.component.html',
  styleUrls: ['./of-from.component.css'],
})
export class OfFromComponent {
  obsMsg: any = [];
  constructor(private utility: UtilitesService, private router: Router) {}
  isLoading=true
  ngOnInit() {
  
    // of with string arguments- of is used to emit a sequence of values
    const source = of('shivam', 'Ram', 'Shyam', 'Rahul', 'Rajesh');
    source
      .pipe(
        tap(() => {
          this.isLoading = true;
        }),
        delay(2000),
        tap(()=>{this.isLoading = false;})
      )
      .subscribe((val) => {
        this.utility.print(val, 'elContainer');
      
      });
    // of with object
    const source2 = of(
      { name: 'shivam', age: 25 },
      { name: 'Ram', age: 26 },
      { name: 'Shyam', age: 27 },
      { name: 'Rahul', age: 28 },
      { name: 'Rajesh', age: 29 }
    );
    source2.subscribe((val) => {
      this.obsMsg.push(val);
    });

    //from with array values- from is used to emit a sequence of values from an array
    const source3 = from(['shivam', 'Ram', 'Shyam', 'Rahul', 'Rajesh']);
    source3.subscribe((val) => {
      console.log(val);
      this.utility.print(val, 'elContainer2');
    });

    //from with promise- from is used to emit a sequence of values from a promise
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Promise resolved');
      }, 2000);
    });
    const source4 = from(promise);
    source4.subscribe((val) => {
      console.log(val);
      this.utility.print(val, 'elContainer3');
    });

    // //from with string
    const source5 = from('hello shivam');
    source5.subscribe((val) => {
      console.log(val);
      this.utility.print(val, 'elContainer4');
    });

    // //from with map
    // const source = from([1, 2, 3, 4, 5]);
    // //output: 2,4,6,8,10
    // const subscribe = source.pipe(map(val => val * 2)).subscribe(val => console.log(val));

    // //from with filter
    // const source = from([1, 2, 3, 4, 5]);
    // //output: 2,4
    // const subscribe = source.pipe(filter(val => val % 2 === 0)).subscribe(val => console.log(val));

    // //from with reduce
    // const source = from([1, 2, 3, 4, 5]);
    // //output: 15
    // const subscribe = source.pipe(reduce((acc, val) => acc + val)).subscribe(val => console.log(val));

    // //from with scan
    // const source = from([1, 2, 3, 4, 5]);
    // //output: 1,3,6,10,15
    // const subscribe = source.pipe(scan((acc, val) => acc + val)).subscribe(val => console.log(val));

    // //from with mergeMap
    // const source = from([1, 2, 3, 4, 5]);
    // //output: 1,2,3,4,5
    // const subscribe = source.pipe(mergeMap(val => of(val))).subscribe(val => console.log(val));

    // //from with switchMap
    // const source = from([1, 2, 3, 4, 5]);
    // //output: 5
    // const subscribe = source.pipe(switchMap(val => of(val))).subscribe(val => console.log(val));

    // //from
  }

  goBackToDashboard(): void {
    this.router.navigate(['/obserable']);
  }
}
