import { Component } from '@angular/core';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  exclusive: boolean = false;
  constructor(private utility: UtilitesService) {}

  ngOnInit() {
    this.utility.exclusive.subscribe((data) => {
      this.exclusive = data;
    });
  }
}
