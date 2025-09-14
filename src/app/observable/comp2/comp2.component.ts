import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-comp2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comp2.component.html',
  styleUrls: ['./comp2.component.css'],
})
export class Comp2Component {
  constructor(private uitlty: UtilitesService) {}
  userName!: string;
  ngOnInit() {
    this.uitlty.userNames.subscribe((name) => {
      this.userName = name;
    });
  }
  OnChange(userNameLatest: string) {
    this.userName =userNameLatest
    this.uitlty.userNames.next(userNameLatest);
  }
}
