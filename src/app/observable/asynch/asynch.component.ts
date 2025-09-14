import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';
@Component({
  selector: 'app-asynch',
  templateUrl: './asynch.component.html',
  styleUrls: ['./asynch.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AsynchComponent implements OnInit {
  asyncVideo = '';
  asyncSub= 'async subject are used to get the last value of the observable when the observable is completed. It will only emit the last value of the observable.'
  constructor(private utility: UtilitesService, private router: Router) {}

  ngOnInit() {
    this.utility.asyncVideoEmit.subscribe((res) => {
      console.log(res);
      
      this.asyncVideo = res;
    });
  }
  UserData(useValue: string) {
    console.log(useValue);
    
    this.utility.asyncVideoEmit.next(useValue);
  }

  OnComplete() {
    this.utility.asyncVideoEmit.complete();
  }

  goBackToDashboard() {
    this.router.navigate(['/observable-operators']);
  }
}
