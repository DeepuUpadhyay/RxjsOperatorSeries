import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promise',
  templateUrl: './promise.component.html',
  styleUrls: ['./promise.component.css'],
})
export class PromiseComponent implements OnInit {
  DellLaptop() {
    return setTimeout(() => {
      return 'Dell Laptop has been purchased';
    }, 8000);
  }

  hpLaptop() {
    return setTimeout(() => {
      return 'HP Laptop has been purchased';
    }, 3000);
  }

  ngOnInit() {
    let buyMobile = new Promise((resolve, reject) => {
      if (this.DellLaptop()) {
        resolve('Dell Laptop has been purchased');
      } else if (!this.hpLaptop()) {
        resolve('HP Laptop has been purchased');
      } else {
        reject('I have not bought the mobile');
      }
    });

    buyMobile
      .then((res) => {
        console.log('success=>', res);
      })
      .catch((err) => {
        console.log('I have not bought the mobile=>', err);
      });
  }
}
