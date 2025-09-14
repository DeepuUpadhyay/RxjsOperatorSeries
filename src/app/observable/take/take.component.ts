import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { from, fromEvent, interval, timer, of } from 'rxjs';
import { map, take, takeLast, takeUntil, tap, delay } from 'rxjs/operators';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-take',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './take.component.html',
  styleUrls: ['./take.component.css'],
})
export class TakeComponent implements OnInit {
  
  // Operator Definition
  operatorDefinition = `
    Take: Emits only the first 'count' values emitted by the source Observable, then completes.
    It's perfect for limiting the number of emissions from an observable stream.
    Variants: take(n), takeLast(n), takeUntil(notifier), takeWhile(predicate)
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. Pagination - First N Items",
      description: "Load only the first 10 products on page load, useful for performance optimization.",
      code: `
        productAPI.getAllProducts().pipe(
          take(10)
        ).subscribe(products => displayProducts(products));
      `
    },
    {
      title: "2. One-time Welcome Message",
      description: "Show welcome notification only for the first login, ignore subsequent events.",
      code: `
        userLogin$.pipe(
          take(1),
          map(() => 'Welcome to our app!')
        ).subscribe(message => showNotification(message));
      `
    },
    {
      title: "3. Limited Retry Attempts",
      description: "Allow only 3 retry attempts for API calls to prevent infinite loops.",
      code: `
        apiCall$.pipe(
          retry(3),
          take(1)
        ).subscribe(data => handleSuccess(data));
      `
    }
  ];

  constructor(private utility: UtilitesService, private router: Router) {}

  ngOnInit(): void {
    this.basicExample();
    this.realLifeExample1();
    this.realLifeExample2();
    this.realLifeExample3();
  }

  basicExample() {
    this.utility.print('=== Basic Take Examples ===', 'elContainer');
    
    const userData = [
      'Mahesh', 'Rajesh', 'Abhishek', 'Ashwin', 'Rahne', 'Virat', 'Dhoni'
    ];
    
    // Ex - 01 | take operator
    this.utility.print('1. Take first 5 users:', 'elContainer');
    const source = from(userData).pipe(take(5));

    source.subscribe((res) => {
      this.utility.print(res, 'elContainer');
    });

    // Ex - 02 | takeLast operator
    this.utility.print('2. Take last 3 users:', 'elContainer2');
    from(userData).pipe(
      takeLast(3)
    ).subscribe((res) => {
      this.utility.print(res, 'elContainer2');
    });

    // Ex - 03 | takeUntil operator
    this.utility.print('3. Take until click (click anywhere to stop):', 'elContainer3');
    const source2 = interval(1000);
    const clickEvent = fromEvent(document, 'click');
    source2.pipe(
      takeUntil(clickEvent),
      map((data) => 'Number ' + data)
    ).subscribe((res) => {
      this.utility.print(res, 'elContainer3');
    });
  }

  realLifeExample1() {
    this.utility.print('=== Real-Life Example 1: Product Pagination ===', 'elContainer4');
    
    // Simulate loading first 5 products
    const allProducts = [
      'Laptop', 'Phone', 'Tablet', 'Watch', 'Camera', 'Speaker', 'Headphones', 'Mouse', 'Keyboard', 'Monitor'
    ];
    
    from(allProducts).pipe(
      take(5),
      delay(500)
    ).subscribe(product => {
      this.utility.print(`Product: ${product}`, 'elContainer4');
    });
  }

  realLifeExample2() {
    this.utility.print('=== Real-Life Example 2: One-time Welcome Message ===', 'elContainer5');
    
    // Simulate multiple user login events
    const loginEvents = timer(0, 2000).pipe(
      map(i => `User login attempt ${i + 1}`)
    );
    
    loginEvents.pipe(
      take(1), // Only show welcome message once
      map(event => `Welcome! (${event})`)
    ).subscribe(message => {
      this.utility.print(message, 'elContainer5');
    });
  }

  realLifeExample3() {
    this.utility.print('=== Real-Life Example 3: Limited API Retries ===', 'elContainer6');
    
    // Simulate API calls with failures
    const apiAttempts = timer(0, 1500).pipe(
      map(i => {
        if (i < 2) {
          throw new Error(`API Call ${i + 1} failed`);
        }
        return `API Call ${i + 1} succeeded!`;
      })
    );
    
    apiAttempts.pipe(
      take(3) // Limit to 3 attempts
    ).subscribe({
      next: result => this.utility.print(result, 'elContainer6'),
      error: err => this.utility.print(`Error: ${err.message}`, 'elContainer6')
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/observable-operators']);
  }
}
