import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-replay-subject',
  templateUrl: './replay-subject.component.html',
  styleUrls: ['./replay-subject.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ReplaySubjectComponent implements OnInit {
  userList1 = ['Angular 1', 'Angular 2'];
  userList2: any = [];
  userList3: string[] = [];
  constructor(private utility: UtilitesService, private router: Router) {}
  //subscribe mods
  subscribeMod2: boolean = false;
  subscribeMod3: boolean = false;
  //subscription
  subscription2!: Subscription;
  subscription3!: Subscription;
  ngOnInit() {
    this.utility.videoEmit.subscribe((res) => {
      this.userList1.push(res);
    });
  }
  UserData(useValue: string) {
    this.utility.videoEmit.next(useValue);
  }
  replaySubject='Replay subject is used to store the previous values and it will emit the previous values to the new subscribers.'
  //subscribe2
  subscribe2() {
    if (this.subscribeMod2) {
      this.subscription2.unsubscribe();
    } else {
      this.subscription2 = this.utility.videoEmit.subscribe((res) => {
        this.userList2.push(res);
      });
    }
    this.subscribeMod2 = !this.subscribeMod2;
  }
  //subscribe3
  subscribe3() {
    if (this.subscribeMod3) {
      this.subscription3.unsubscribe();
    } else {
      this.subscription3 = this.utility.videoEmit.subscribe((res) => {
        this.userList3.push(res);
      });
    }
    this.subscribeMod3 = !this.subscribeMod3;
  }

  goBackToDashboard() {
    this.router.navigate(['/observable-operators']);
  }
}
