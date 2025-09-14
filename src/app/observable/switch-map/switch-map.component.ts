import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { delay, from, map, of, switchAll, switchMap, timer, interval } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-switch-map',
  templateUrl: './switch-map.component.html',
  styleUrls: ['./switch-map.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SwitchMapComponent implements OnInit {
  
  // Operator Definition
  operatorDefinition = `
    SwitchMap: Projects each source value to an Observable, but only subscribes to the most recent one. 
    It cancels previous inner observables when a new value arrives, keeping only the latest.
    Formula: switchMap = map + switchAll (with cancellation)
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. Search Autocomplete",
      description: "Cancel previous search requests when user types new characters. Only show results for the latest query.",
      code: `
        searchInput$.pipe(
          debounceTime(300),
          switchMap(query => searchAPI(query))
        ).subscribe(results => showSuggestions(results));
      `
    },
    {
      title: "2. Route Navigation",
      description: "Cancel previous route data loading when navigating to a new route quickly.",
      code: `
        route.params.pipe(
          switchMap(params => loadUserData(params.id))
        ).subscribe(user => displayUser(user));
      `
    }
  ];

  constructor(private utility: UtilitesService, private router: Router) {}

  ngOnInit() {
    this.basicExample();
    this.realLifeExample1();
    this.realLifeExample2();
  }

  basicExample() {
    this.utility.print('=== Basic SwitchMap Example ===', 'elContainer');
    const source = from(['Tech', 'Comedy', 'News']);
    
    // Ex-01 Normal Map (creates nested observables)
    this.utility.print('1. Normal Map (nested observables):', 'elContainer');
    source
      .pipe(map((data) => this.getData(data)))
      .subscribe((res) =>
        res.subscribe((res2) => this.utility.print(res2, 'elContainer'))
      );
    
    // Ex-02 map + switchAll (manual switching)
    this.utility.print('2. Map + SwitchAll (manual switching):', 'elContainer2');
    source
      .pipe(
        map((data) => this.getData(data)),
        switchAll()
      )
      .subscribe((res) => this.utility.print(res, 'elContainer2'));
    
    // Ex-03 switchMap (automatic switching)
    this.utility.print('3. SwitchMap (automatic switching):', 'elContainer3');
    source
      .pipe(switchMap((data) => this.getData(data)))
      .subscribe((res) => this.utility.print(res, 'elContainer3'));
  }

  realLifeExample1() {
    this.utility.print('=== Real-Life Example 1: Search Autocomplete ===', 'elContainer4');
    
    // Simulate rapid search queries (like user typing)
    const searchTerms = ['a', 'an', 'ang', 'angu', 'angul', 'angular'];
    
    // Add delay between queries to simulate user typing
    timer(0, 800).pipe(
      switchMap(index => {
        if (index < searchTerms.length) {
          const query = searchTerms[index];
          return this.simulateSearchAPI(query);
        }
        return of(null);
      })
    ).subscribe(result => {
      if (result) {
        this.utility.print(`Search result: ${result}`, 'elContainer4');
      }
    });
  }

  realLifeExample2() {
    this.utility.print('=== Real-Life Example 2: Route Data Loading ===', 'elContainer5');
    
    // Simulate rapid route changes
    const userIds = from([1, 2, 3, 4, 5]);
    
    userIds.pipe(
      switchMap(userId => this.simulateUserDataLoad(userId))
    ).subscribe(userData => {
      this.utility.print(`User data loaded: ${userData}`, 'elContainer5');
    });
  }

  getData(data: string) {
    return of(data + ' Video Uploaded').pipe(delay(2000));
  }

  // Simulate search API with varying response times
  simulateSearchAPI(query: string) {
    // Longer queries take more time to simulate database search
    const searchTime = query.length * 300 + 200;
    return of(`Found results for "${query}"`).pipe(delay(searchTime));
  }

  // Simulate user data loading with random delays
  simulateUserDataLoad(userId: number) {
    const loadTime = Math.random() * 1500 + 500; // 500ms to 2s
    return of(`User ${userId} data loaded`).pipe(delay(loadTime));
  }

  goBackToDashboard() {
    this.router.navigate(['/observable-operators']);
  }
}
