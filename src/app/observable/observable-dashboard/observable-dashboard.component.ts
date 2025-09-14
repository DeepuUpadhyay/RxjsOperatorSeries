import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterModule,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Observable,
  Subject,
  BehaviorSubject,
  fromEvent,
  interval,
  of,
  merge,
  combineLatest,
  filter,
  map,
  debounceTime,
  switchMap,
  takeUntil,
  distinctUntilChanged,
  startWith,
} from 'rxjs';

interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}

interface ActivityLog {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  status: 'success' | 'warning' | 'error';
}

interface OperatorDemo {
  name: string;
  description: string;
  isActive: boolean;
  result: any;
}

interface OperatorCard {
  id: string;
  name: string;
  icon: string;
  description: string;
  category:
    | 'Creation'
    | 'Transformation'
    | 'Filtering'
    | 'Combination'
    | 'Utility'
    | 'Error Handling';
  difficulty: 1 | 2 | 3 | 4 | 5;
  route: string;
  useCases: string[];
  interviewTip: string;
}

@Component({
  selector: 'app-observable-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './observable-dashboard.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ObservableDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new BehaviorSubject<string>('');
  private refreshSubject = new Subject<void>();

  // Signals for reactive state management
  searchTerm = signal<string>('');
  selectedTimeframe = signal<string>('24h');
  isLiveMode = signal<boolean>(true);
  selectedOperator = signal<string>('all');

  // Dashboard data
  metrics = signal<DashboardMetric[]>([
    {
      id: 'active-users',
      title: 'Active Users',
      value: 1234,
      change: 12.5,
      icon: '👥',
      color: 'primary',
    },
    {
      id: 'api-calls',
      title: 'API Calls',
      value: 89012,
      change: -3.2,
      icon: '🔗',
      color: 'success',
    },
    {
      id: 'errors',
      title: 'Error Rate',
      value: 0.8,
      change: -15.7,
      icon: '⚠️',
      color: 'warning',
    },
    {
      id: 'response-time',
      title: 'Avg Response',
      value: 245,
      change: 5.1,
      icon: '⚡',
      color: 'info',
    },
  ]);

  activityLogs = signal<ActivityLog[]>([
    {
      id: '1',
      timestamp: new Date(),
      action: 'User login successful',
      user: 'alice@company.com',
      status: 'success',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      action: 'API rate limit exceeded',
      user: 'system',
      status: 'warning',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      action: 'Database connection failed',
      user: 'system',
      status: 'error',
    },
  ]);

  operatorDemos = signal<OperatorDemo[]>([
    {
      name: 'filter',
      description: 'Filtering active users from stream',
      isActive: false,
      result: null,
    },
    {
      name: 'map',
      description: 'Transforming user data',
      isActive: false,
      result: null,
    },
    {
      name: 'debounceTime',
      description: 'Debouncing search input',
      isActive: false,
      result: null,
    },
    {
      name: 'merge',
      description: 'Combining multiple data streams',
      isActive: false,
      result: null,
    },
  ]);

  // All available operators in the project
  allOperators = signal<OperatorCard[]>([
    {
      id: 'fromEvent',
      name: 'fromEvent',
      icon: '🎯',
      description: 'Creates an Observable from DOM events',
      category: 'Creation',
      difficulty: 2,
      route: 'from-event',
      useCases: ['Button clicks', 'Form validation', 'User interactions'],
      interviewTip: 'Perfect for explaining reactive programming fundamentals',
    },
    {
      id: 'interval',
      name: 'interval',
      icon: '⏰',
      description:
        'Creates an Observable that emits sequential numbers every specified interval',
      category: 'Creation',
      difficulty: 1,
      route: 'interval',
      useCases: ['Polling', 'Timers', 'Real-time updates'],
      interviewTip: 'Great for demonstrating time-based operations',
    },
    {
      id: 'map',
      name: 'map',
      icon: '🔄',
      description: 'Transforms each value emitted by the source Observable',
      category: 'Transformation',
      difficulty: 1,
      route: 'map',
      useCases: [
        'Data transformation',
        'API response mapping',
        'Type conversion',
      ],
      interviewTip: 'Most commonly used operator, similar to Array.map()',
    },
    {
      id: 'filter',
      name: 'filter',
      icon: '🔍',
      description: 'Filters items emitted by the source Observable',
      category: 'Filtering',
      difficulty: 1,
      route: 'filter',
      useCases: ['Data filtering', 'Conditional logic', 'User permissions'],
      interviewTip:
        'Explain difference from map - filter removes, map transforms',
    },
    {
      id: 'debounce',
      name: 'debounceTime',
      icon: '⏱️',
      description:
        'Delays emissions until a specified time has passed without another emission',
      category: 'Filtering',
      difficulty: 2,
      route: 'debounce-time',
      useCases: ['Search optimization', 'API rate limiting', 'Form validation'],
      interviewTip:
        'Essential for performance optimization in real applications',
    },
    {
      id: 'merge',
      name: 'merge',
      icon: '🤝',
      description: 'Combines multiple Observables into one Observable',
      category: 'Combination',
      difficulty: 2,
      route: 'merge',
      useCases: [
        'Multiple data sources',
        'Event stream merging',
        'Parallel processing',
      ],
      interviewTip:
        'Compare with concat to show concurrent vs sequential behavior',
    },
    {
      id: 'concat',
      name: 'concat',
      icon: '⛓️',
      description: 'Sequentially combines multiple Observables',
      category: 'Combination',
      difficulty: 2,
      route: 'concat-map',
      useCases: [
        'Sequential operations',
        'Ordered data loading',
        'Step workflows',
      ],
      interviewTip:
        'Perfect for demonstrating sequential vs parallel execution',
    },
    {
      id: 'switchMap',
      name: 'switchMap',
      icon: '🔀',
      description:
        'Projects each source value to an Observable, cancelling previous inner observables',
      category: 'Transformation',
      difficulty: 4,
      route: 'switch-map',
      useCases: [
        'HTTP request cancellation',
        'Search typeahead',
        'Auto-complete',
      ],
      interviewTip:
        'Advanced operator, explain cancellation behavior vs mergeMap',
    },
    {
      id: 'mergeMap',
      name: 'mergeMap',
      icon: '🌊',
      description:
        'Projects each source value to an Observable which is merged in output',
      category: 'Transformation',
      difficulty: 4,
      route: 'merge-map',
      useCases: [
        'Parallel API calls',
        'File processing',
        'Independent operations',
      ],
      interviewTip:
        'Compare with switchMap and concatMap for interview discussions',
    },
    {
      id: 'concatMap',
      name: 'concatMap',
      icon: '📋',
      description:
        'Projects each source value to an Observable in a serialized fashion',
      category: 'Transformation',
      difficulty: 3,
      route: 'concat',
      useCases: [
        'Sequential API calls',
        'Ordered processing',
        'Queue operations',
      ],
      interviewTip: 'Demonstrate sequential execution and order preservation',
    },
    {
      id: 'subject',
      name: 'Subject',
      icon: '📡',
      description:
        'A special Observable that allows multicasting to multiple Observers',
      category: 'Utility',
      difficulty: 3,
      route: 'subject',
      useCases: ['Component communication', 'Event bus', 'State management'],
      interviewTip: 'Core concept for Angular services and data sharing',
    },
    {
      id: 'replay-subject',
      name: 'ReplaySubject',
      icon: '🔄',
      description: 'Records and replays old values to new subscribers',
      category: 'Utility',
      difficulty: 3,
      route: 'replay-subject',
      useCases: ['State caching', 'Latest values', 'Buffer management'],
      interviewTip: 'Explain buffer behavior and memory considerations',
    },
    {
      id: 'async-subject',
      name: 'AsyncSubject',
      icon: '🎯',
      description: 'Emits only the last value and only when complete',
      category: 'Utility',
      difficulty: 3,
      route: 'asynch',
      useCases: ['Promise-like behavior', 'Final results', 'Single emissions'],
      interviewTip: 'Compare with Promise behavior and completion timing',
    },
    {
      id: 'take',
      name: 'take',
      icon: '🎲',
      description: 'Emits only the first count values emitted by the source',
      category: 'Filtering',
      difficulty: 1,
      route: 'take',
      useCases: ['Limiting results', 'First-time actions', 'Sample data'],
      interviewTip: 'Simple but important for controlling data flow and memory',
    },
    {
      id: 'retry',
      name: 'retry',
      icon: '🔁',
      description:
        'Returns an Observable that mirrors the source with error retry logic',
      category: 'Error Handling',
      difficulty: 3,
      route: 'retry',
      useCases: [
        'Network resilience',
        'API failure recovery',
        'Robust applications',
      ],
      interviewTip:
        'Essential for production applications, discuss retry strategies',
    },
    {
      id: 'of-from',
      name: 'of / from',
      icon: '📦',
      description: 'Creation operators for various data types',
      category: 'Creation',
      difficulty: 1,
      route: 'of-from',
      useCases: ['Data conversion', 'Observable creation', 'Testing'],
      interviewTip:
        'Fundamental operators for creating Observables from static data',
    },
    {
      id: 'pluck',
      name: 'pluck',
      icon: '🎯',
      description: 'Selects properties to emit from source objects',
      category: 'Transformation',
      difficulty: 2,
      route: 'pluck',
      useCases: [
        'Property extraction',
        'Data simplification',
        'API response parsing',
      ],
      interviewTip:
        'Useful for object property extraction, similar to map with property access',
    },
    {
      id: 'forkJoin',
      name: 'forkJoin',
      icon: '🍴',
      description:
        'Waits for all source Observables to complete, then emits the last values',
      category: 'Combination',
      difficulty: 3,
      route: 'forkJoin',
      useCases: [
        'Parallel HTTP requests',
        'All-or-nothing operations',
        'Data aggregation',
      ],
      interviewTip:
        'Similar to Promise.all(), explain when all observables must complete',
    },
    {
      id: 'custom-observable',
      name: 'Custom Observable',
      icon: '🛠️',
      description: 'Create custom observables from scratch',
      category: 'Creation',
      difficulty: 2,
      route: 'custom',
      useCases: [
        'Custom data sources',
        'Event emitters',
        'API wrappers',
      ],
      interviewTip: 'Demonstrates understanding of Observable internals',
    },
    {
      id: 'to-array',
      name: 'toArray',
      icon: '📦',
      description: 'Collects all emitted values into an array',
      category: 'Utility',
      difficulty: 1,
      route: 'to-array',
      useCases: [
        'Collecting stream results',
        'Batch processing',
        'Data aggregation',
      ],
      interviewTip: 'Explain when observable completes vs infinite streams',
    },
  ]);

  // Computed properties
  filteredMetrics = computed(() => {
    const search = this.searchTerm().toLowerCase();
    return this.metrics().filter(
      (metric) =>
        metric.title.toLowerCase().includes(search) ||
        metric.id.toLowerCase().includes(search)
    );
  });

  filteredLogs = computed(() => {
    const search = this.searchTerm().toLowerCase();
    return this.activityLogs().filter(
      (log) =>
        log.action.toLowerCase().includes(search) ||
        log.user.toLowerCase().includes(search)
    );
  });

  filteredOperators = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const category = this.selectedOperator();

    return this.allOperators().filter((operator) => {
      const matchesSearch =
        !search ||
        operator.name.toLowerCase().includes(search) ||
        operator.description.toLowerCase().includes(search) ||
        operator.useCases.some((useCase) =>
          useCase.toLowerCase().includes(search)
        );

      const matchesCategory =
        category === 'all' ||
        operator.category.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  });

  timeframeOptions = ['1h', '6h', '24h', '7d', '30d'];
  operatorOptions = [
    'all',
    'creation',
    'transformation',
    'filtering',
    'combination',
    'utility',
    'error handling',
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.setupReactiveStreams();
    this.startLiveUpdates();
    this.demonstrateOperators();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupReactiveStreams(): void {
    // Search functionality with debouncing
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm.set(term);
        console.log('Search updated:', term);
      });

    // Refresh functionality
    this.refreshSubject
      .pipe(
        switchMap(() => this.fetchDashboardData()),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        console.log('Dashboard refreshed:', data);
      });

    // Combine multiple streams for comprehensive updates
    const timeframe$ = of(this.selectedTimeframe());
    const liveMode$ = of(this.isLiveMode());

    combineLatest([timeframe$, liveMode$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([timeframe, isLive]) => {
        console.log('Dashboard config:', { timeframe, isLive });
        this.updateDashboardData(timeframe, isLive);
      });
  }

  private startLiveUpdates(): void {
    if (!this.isLiveMode()) return;

    // Simulate real-time updates every 5 seconds
    interval(5000)
      .pipe(
        filter(() => this.isLiveMode()),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateMetrics();
        this.addActivityLog();
      });
  }

  private demonstrateOperators(): void {
    // Demonstrate filter operator
    this.runOperatorDemo('filter', () => {
      const numbers$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
      return numbers$.pipe(
        filter((n) => n % 2 === 0),
        map((n) => `Even: ${n}`)
      );
    });

    // Demonstrate map operator
    this.runOperatorDemo('map', () => {
      const users$ = of(
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Carol', age: 28 }
      );
      return users$.pipe(map((user) => `${user.name} (${user.age} years old)`));
    });

    // Demonstrate debounceTime with search
    this.runOperatorDemo('debounceTime', () => {
      return this.searchSubject.pipe(
        debounceTime(500),
        map((term) => `Debounced search: "${term}"`)
      );
    });

    // Demonstrate merge operator
    this.runOperatorDemo('merge', () => {
      const stream1$ = interval(1000).pipe(map((i) => `Stream1: ${i}`));
      const stream2$ = interval(1500).pipe(map((i) => `Stream2: ${i}`));
      return merge(stream1$, stream2$);
    });
  }

  private runOperatorDemo(
    operatorName: string,
    demoFn: () => Observable<any>
  ): void {
    const demo = this.operatorDemos().find((d) => d.name === operatorName);
    if (!demo) return;

    demo.isActive = true;
    this.operatorDemos.set([...this.operatorDemos()]);

    demoFn()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          demo.result = result;
          this.operatorDemos.set([...this.operatorDemos()]);
        },
        error: (error) => {
          demo.result = `Error: ${error.message}`;
          demo.isActive = false;
          this.operatorDemos.set([...this.operatorDemos()]);
        },
      });
  }

  private fetchDashboardData(): Observable<any> {
    // Simulate API call
    return of({
      timestamp: new Date(),
      metrics: this.generateRandomMetrics(),
      logs: this.generateRandomLogs(),
    });
  }

  private updateDashboardData(timeframe: string, isLive: boolean): void {
    console.log(`Updating dashboard for ${timeframe}, live: ${isLive}`);
    // Simulate data update based on timeframe
  }

  private updateMetrics(): void {
    const updatedMetrics = this.metrics().map((metric) => ({
      ...metric,
      value: metric.value + Math.floor(Math.random() * 10) - 5,
      change: (Math.random() - 0.5) * 20,
    }));
    this.metrics.set(updatedMetrics);
  }

  private addActivityLog(): void {
    const actions = [
      'User authentication',
      'API request processed',
      'Cache invalidated',
      'Background job completed',
      'System health check',
    ];

    const statuses: ('success' | 'warning' | 'error')[] = [
      'success',
      'warning',
      'error',
    ];

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: actions[Math.floor(Math.random() * actions.length)],
      user: 'system',
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };

    this.activityLogs.set([newLog, ...this.activityLogs().slice(0, 9)]);
  }

  private generateRandomMetrics(): DashboardMetric[] {
    return this.metrics().map((metric) => ({
      ...metric,
      value: Math.floor(Math.random() * 10000),
      change: (Math.random() - 0.5) * 50,
    }));
  }

  private generateRandomLogs(): ActivityLog[] {
    return Array(5)
      .fill(null)
      .map((_, i) => ({
        id: `random-${i}`,
        timestamp: new Date(Date.now() - i * 60000),
        action: `Random action ${i + 1}`,
        user: `user${i + 1}@example.com`,
        status: ['success', 'warning', 'error'][
          Math.floor(Math.random() * 3)
        ] as any,
      }));
  }

  // Public methods for template
  onSearchChange(term: string): void {
    this.searchSubject.next(term);
  }

  onTimeframeChange(timeframe: string): void {
    this.selectedTimeframe.set(timeframe);
  }

  toggleLiveMode(): void {
    this.isLiveMode.set(!this.isLiveMode());
    if (this.isLiveMode()) {
      this.startLiveUpdates();
    }
  }

  refreshDashboard(): void {
    this.refreshSubject.next();
  }

  onOperatorChange(operator: string): void {
    this.selectedOperator.set(operator);
  }

  getMetricChangeClass(change: number): string {
    if (change > 0) return 'change-positive';
    if (change < 0) return 'change-negative';
    return 'change-neutral';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'error':
        return 'badge-error';
      default:
        return 'badge-default';
    }
  }

  formatTimestamp(timestamp: Date): string {
    return timestamp.toLocaleTimeString();
  }

  trackByMetric(index: number, metric: DashboardMetric): string {
    return metric.id;
  }

  trackByLog(index: number, log: ActivityLog): string {
    return log.id;
  }

  trackByDemo(index: number, demo: OperatorDemo): string {
    return demo.name;
  }

  trackByOperator(index: number, operator: OperatorCard): string {
    return operator.id;
  }

  navigateToOperator(operator: OperatorCard): void {
    console.log('=== Navigation Debug ===');
    console.log('Operator clicked:', operator.name);
    console.log('Operator route:', operator.route);
    console.log('Full navigation path:', ['/observable-operators', operator.route]);
    console.log('Expected URL:', `/observable-operators/${operator.route}`);
    
    // Navigate to the individual operator page
    this.router.navigate(['/observable-operators', operator.route])
      .then((success) => {
        console.log('Navigation success:', success);
        if (!success) {
          console.error('Navigation failed - route might not exist');
        }
      })
      .catch((error) => {
        console.error('Navigation error:', error);
      });
  }

  getDifficultyStars(difficulty: number): number[] {
    return Array(difficulty).fill(0);
  }

  getCategoryIcon(category: string): string {
    const icons = {
      Creation: '🏗️',
      Transformation: '🔄',
      Filtering: '🔍',
      Combination: '🤝',
      Utility: '🛠️',
      'Error Handling': '🚨',
    };
    return icons[category as keyof typeof icons] || '📦';
  }

  getDifficultyColor(difficulty: number): string {
    const colors = {
      1: 'easy',
      2: 'medium',
      3: 'medium-hard',
      4: 'hard',
      5: 'expert',
    };
    return colors[difficulty as keyof typeof colors] || 'medium';
  }
}
