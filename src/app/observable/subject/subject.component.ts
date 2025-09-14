import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UtilitesService } from 'src/app/services/utilites.service';
import { Comp1Component } from '../comp1/comp1.component';
import { Comp2Component } from '../comp2/comp2.component';
import { Comp3Component } from '../comp3/comp3.component';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, Comp1Component, Comp2Component, Comp3Component],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit, OnDestroy{
  userNameLatest!: string;
  constructor(private utility: UtilitesService, private router: Router) {
    this.utility.userNames.subscribe((name) => {
      this.userNameLatest = name;
    });
  }
  ngOnInit() {
    this.utility.exclusive.next(true);
  }
  ngOnDestroy() {
    this.utility.exclusive.next(false);
  }

  goBackToDashboard(): void {
    this.router.navigate(['/obserable']);
  }
}
