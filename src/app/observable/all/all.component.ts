import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css'],
})
export class AllComponent implements OnInit {
  constructor(private route: Router) {}
  ngOnInit() {}

  tab() {
    this.route.navigate(['obserable/tab']);
  }

  goBackToDashboard(): void {
    this.route.navigate(['/obserable']);
  }
}
