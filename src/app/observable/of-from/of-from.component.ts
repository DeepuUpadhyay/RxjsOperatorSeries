import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { delay, from, of, tap, map, filter, reduce, scan, Subject, takeUntil, interval } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-of-from',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './of-from.component.html',
  styleUrls: ['./of-from.component.css'],
})
export class OfFromComponent implements OnInit, OnDestroy {
  obsMsg: any = [];
  isLoading = true;
  private destroy$ = new Subject<void>();

  // Operator Definition
  operatorDefinition = `
    OF & FROM: Creation operators that convert various data sources into Observables.
    - OF: Creates an observable from individual values or objects passed as arguments
    - FROM: Converts arrays, promises, iterables, or other observables into an observable sequence
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. Configuration Loading (OF)",
      description: "Create observables from configuration objects or static data.",
      code: `
        // Load app configuration
        const config = of({
          apiUrl: 'https://api.example.com',
          timeout: 5000,
          retries: 3
        });
        
        config.subscribe(cfg => this.setupApp(cfg));
      `
    },
    {
      title: "2. User List Processing (FROM)",
      description: "Convert user arrays or API responses into observable streams for processing.",
      code: `
        // Process user array
        const users = ['John', 'Jane', 'Bob'];
        from(users).pipe(
          map(user => \`Hello \${user}\`),
          filter(greeting => greeting.includes('J'))
        ).subscribe(result => console.log(result));
      `
    },
    {
      title: "3. Promise to Observable (FROM)",
      description: "Convert existing promises to observables for better composition.",
      code: `
        // Convert fetch promise to observable
        const dataPromise = fetch('/api/data');
        from(dataPromise).pipe(
          map(response => response.json()),
          retry(3)
        ).subscribe(data => this.handleData(data));
      `
    }
  ];

  constructor(private utility: UtilitesService, private router: Router) {}

  ngOnInit() {
    this.basicOfExamples();
    this.basicFromExamples();
    this.realLifeExamples1();
    this.realLifeExamples2();
    this.realLifeExamples3();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  basicOfExamples() {
    this.utility.print('=== OF Operator Examples ===', 'ofContainer');
    
    // OF with string arguments
    this.utility.print('1. OF with multiple values:', 'ofContainer');
    const source = of('Alice', 'Bob', 'Charlie', 'Diana', 'Eve');
    source
      .pipe(
        tap(() => this.isLoading = true),
        delay(2000),
        tap(() => this.isLoading = false),
        takeUntil(this.destroy$)
      )
      .subscribe((val) => {
        this.utility.print(`  → ${val}`, 'ofContainer');
      });

    // OF with objects
    this.utility.print('2. OF with objects:', 'ofContainer');
    const source2 = of(
      { name: 'Alice', age: 25, role: 'Developer' },
      { name: 'Bob', age: 30, role: 'Designer' },
      { name: 'Charlie', age: 28, role: 'Manager' }
    );
    source2.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      this.obsMsg.push(val);
      this.utility.print(`  → ${val.name} (${val.role})`, 'ofContainer');
    });

    // OF with mixed types
    this.utility.print('3. OF with mixed types:', 'ofContainer');
    const source3 = of(42, 'Hello', true, {key: 'value'}, [1, 2, 3]);
    source3.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      this.utility.print(`  → ${typeof val}: ${JSON.stringify(val)}`, 'ofContainer');
    });
  }

  basicFromExamples() {
    this.utility.print('=== FROM Operator Examples ===', 'fromContainer');
    
    // FROM with array
    this.utility.print('1. FROM with array:', 'fromContainer');
    const source3 = from(['React', 'Angular', 'Vue', 'Svelte', 'Next.js']);
    source3.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      this.utility.print(`  → Framework: ${val}`, 'fromContainer');
    });

    // FROM with promise
    this.utility.print('2. FROM with promise:', 'fromContainer');
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Promise resolved with user data!');
      }, 2000);
    });
    const source4 = from(promise);
    source4.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      this.utility.print(`  → ${val}`, 'fromContainer');
    });

    // FROM with string (iterable)
    this.utility.print('3. FROM with string (character by character):', 'fromContainer');
    const source5 = from('RxJS');
    source5.pipe(takeUntil(this.destroy$)).subscribe((val) => {
      this.utility.print(`  → Character: ${val}`, 'fromContainer');
    });

    // FROM with Set
    this.utility.print('4. FROM with Set:', 'fromContainer');
    const uniqueSkills = new Set(['JavaScript', 'TypeScript', 'RxJS', 'Angular']);
    from(uniqueSkills).pipe(takeUntil(this.destroy$)).subscribe((val) => {
      this.utility.print(`  → Skill: ${val}`, 'fromContainer');
    });
  }

  realLifeExamples1() {
    this.utility.print('=== Real-Life Example 1: Configuration Management ===', 'example1Container');
    
    // Application configuration using OF
    const appConfig = of({
      apiEndpoint: 'https://jsonplaceholder.typicode.com',
      timeout: 5000,
      retries: 3,
      features: ['caching', 'retry', 'auth']
    });

    const themeConfig = of({
      primaryColor: '#007bff',
      theme: 'light',
      animations: true
    });

    // Process configurations
    appConfig.pipe(takeUntil(this.destroy$)).subscribe(config => {
      this.utility.print(`API Config: ${config.apiEndpoint}`, 'example1Container');
      this.utility.print(`Timeout: ${config.timeout}ms`, 'example1Container');
      this.utility.print(`Features: ${config.features.join(', ')}`, 'example1Container');
    });

    themeConfig.pipe(takeUntil(this.destroy$)).subscribe(config => {
      this.utility.print(`Theme: ${config.theme} (${config.primaryColor})`, 'example1Container');
    });
  }

  realLifeExamples2() {
    this.utility.print('=== Real-Life Example 2: Data Processing Pipeline ===', 'example2Container');
    
    // User data processing using FROM
    const userData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', active: true },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', active: false },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', active: true },
      { id: 4, name: 'Alice Brown', email: 'alice@example.com', active: true }
    ];

    // Process active users only
    from(userData)
      .pipe(
        filter(user => user.active),
        map(user => ({
          ...user,
          displayName: user.name.toUpperCase(),
          domain: user.email.split('@')[1]
        })),
        takeUntil(this.destroy$)
      )
      .subscribe(user => {
        this.utility.print(`Active User: ${user.displayName} @ ${user.domain}`, 'example2Container');
      });

    // Calculate statistics
    from(userData)
      .pipe(
        reduce((acc, user) => ({
          total: acc.total + 1,
          active: acc.active + (user.active ? 1 : 0),
          domains: acc.domains.add(user.email.split('@')[1])
        }), { total: 0, active: 0, domains: new Set() }),
        takeUntil(this.destroy$)
      )
      .subscribe(stats => {
        this.utility.print(`Statistics: ${stats.active}/${stats.total} active users`, 'example2Container');
        this.utility.print(`Unique domains: ${Array.from(stats.domains).join(', ')}`, 'example2Container');
      });
  }

  realLifeExamples3() {
    this.utility.print('=== Real-Life Example 3: API Integration ===', 'example3Container');
    
    // Simulate API endpoints using OF
    const apiEndpoints = of(
      '/api/users',
      '/api/posts',
      '/api/comments',
      '/api/todos'
    );

    // Process each endpoint
    apiEndpoints
      .pipe(
        map(endpoint => ({
          url: `https://jsonplaceholder.typicode.com${endpoint}`,
          method: 'GET',
          timestamp: new Date().toISOString()
        })),
        takeUntil(this.destroy$)
      )
      .subscribe(request => {
        this.utility.print(`API Request: ${request.method} ${request.url}`, 'example3Container');
      });

    // Simulate async data loading with FROM
    const loadingTasks = [
      'Initializing application...',
      'Loading user preferences...',
      'Fetching user data...',
      'Setting up dashboard...',
      'Application ready!'
    ];

    from(loadingTasks)
      .pipe(
        map((task, index) => ({ task, step: index + 1, total: loadingTasks.length })),
        delay(800),
        takeUntil(this.destroy$)
      )
      .subscribe(({ task, step, total }) => {
        this.utility.print(`[${step}/${total}] ${task}`, 'example3Container');
      });
  }

  // Interactive demo methods
  demonstrateOfWithCustomData() {
    this.utility.print('=== Custom OF Demo ===', 'customContainer');
    
    const customData = of(
      { type: 'success', message: 'Operation completed successfully' },
      { type: 'warning', message: 'Some data might be outdated' },
      { type: 'info', message: 'New features available' }
    );

    customData.pipe(takeUntil(this.destroy$)).subscribe(notification => {
      this.utility.print(`${notification.type.toUpperCase()}: ${notification.message}`, 'customContainer');
    });
  }

  demonstrateFromWithPromise() {
    this.utility.print('=== Custom FROM Promise Demo ===', 'customContainer');
    
    // Simulate an API call with promise
    const fetchUserData = () => new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: Math.floor(Math.random() * 1000),
          name: 'Random User',
          timestamp: new Date().toLocaleTimeString()
        });
      }, 1500);
    });

    from(fetchUserData()).pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.utility.print(`Fetched: ${JSON.stringify(user)}`, 'customContainer');
    });
  }

  demonstrateFromWithIterable() {
    this.utility.print('=== Custom FROM Iterable Demo ===', 'customContainer');
    
    // FROM with Map
    const skillLevels = new Map([
      ['JavaScript', 'Expert'],
      ['TypeScript', 'Advanced'],
      ['RxJS', 'Intermediate'],
      ['Angular', 'Advanced']
    ]);

    from(skillLevels).pipe(takeUntil(this.destroy$)).subscribe(([skill, level]) => {
      this.utility.print(`${skill}: ${level}`, 'customContainer');
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/observable']);
  }
}
