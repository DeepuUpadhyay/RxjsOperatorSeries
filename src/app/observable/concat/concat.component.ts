import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { concat, interval, map, take } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-concat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concat.component.html',
  styleUrls: ['./concat.component.css'],
})
export class ConcatComponent implements OnInit {
  concats!: string;
  constructor(private utility: UtilitesService) {}
  ngOnInit(): void {
    const source = interval(1000).pipe(
      map((val) => `Video Tech #: ${val + 1}`),
      take(5)
    );
    const source2 = interval(1000).pipe(
      map((val) => `Video comedy #: ${val + 1}`),
      take(3)
    );
    const source3 = interval(1000).pipe(
      map((val) => `Video News #: ${val + 1}`),
      take(2)
    );
 this.concats= 'concat operator is used to combine multiple observables into one observable. It will subscribe to the first observable and wait for it to complete before subscribing to the next observable.'
    const finalObs = concat(source2, source3, source);
    finalObs.subscribe((val) => this.utility.print(val, 'elContainer'));
  }
}
