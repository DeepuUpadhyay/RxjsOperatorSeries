import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-comp3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comp3.component.html',
  styleUrls: ['./comp3.component.css']
})
export class Comp3Component {
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
