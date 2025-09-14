import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { from, map, toArray } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-pluck',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pluck.component.html',
  styleUrls: ['./pluck.component.css'],
})
export class PluckComponent implements OnInit {
  mesg1?: any;
  mesg2?: any;
  mesg3?: any;

  constructor(private router: Router) {}

  ngOnInit() {
    //Example 1
    const userData = [
      {
        name: 'Sachin',
        age: 30,
        skills: 'Cricket',
        residence: { country: 'india', state: 'Mumbai' },
      },
      {
        name: 'Rahul',
        age: 25,
        skills: 'Hockey',
        residence: { country: 'india', state: 'Bangalore' },
      },
      {
        name: 'Virat',
        age: 28,
        skills: 'Football',
        residence: { country: 'india', state: 'Delhi' },
      },
      {
        name: 'Dhoni',
        age: 35,
        skills: 'Tennis',
        residence: { country: 'india', state: 'Kolkata' },
      },
      {
        name: 'Rohit',
        age: 32,
        skills: 'Badminton',
        residence: { country: 'india', state: 'Chennai' },
      },
    ];

    from(userData)
      .pipe(
        // map((data) => {
        //   return { name: data.name, skills: data.skills };
        // }),
        pluck('name'),
        toArray()
      )
      .subscribe((res: any) => {
        this.mesg1 = res;
      });

    //Example 2

    from(userData)
      .pipe(pluck('residence', 'state'), toArray())
      .subscribe((res) => {
        this.mesg2 = res;
      });

    //Example 3
    from(userData)
      .pipe(pluck('skills'), toArray())
      .subscribe((res:any) => {
        this.mesg3 = res;
      });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/obserable']);
  }
}
