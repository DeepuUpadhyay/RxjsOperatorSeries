import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  signal,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { fromEvent, merge, interval, Subscription } from 'rxjs';
import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  throttleTime,
  scan,
  startWith,
  takeUntil,
  switchMap,
  tap,
} from 'rxjs/operators';
import { UtilitesService } from 'src/app/services/utilites.service';

interface ClickData {
  timestamp: number;
  x: number;
  y: number;
  element: string;
  count: number;
}

interface FormValidation {
  field: string;
  value: string;
  isValid: boolean;
  timestamp: number;
}

interface UserActivity {
  type: string;
  target: string;
  timestamp: number;
  data?: any;
}

@Component({
  selector: 'app-from-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './from-event.component.html',
  styleUrls: ['./from-event.component.css'],
})
export class FromEventComponent implements AfterViewInit, OnDestroy {
  private utility = inject(UtilitesService);
  private subscriptions: Subscription[] = [];

  // ViewChild references for modern Angular
  @ViewChild('uploadBtn') uploadBtn!: ElementRef;
  @ViewChild('downloadBtn') downloadBtn!: ElementRef;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('mouseTracker') mouseTracker!: ElementRef;

  // State management with signals
  clickHistory = signal<ClickData[]>([]);
  searchResults = signal<string[]>([]);
  validationStatus = signal<FormValidation[]>([]);
  userActivity = signal<UserActivity[]>([]);
  mousePosition = signal({ x: 0, y: 0 });
  totalClicks = signal(0);
  isSearching = signal(false);
  emailStatus = signal('');

  // Sample data for demonstrations
  private sampleVideos = [
    'Angular Fundamentals Tutorial',
    'RxJS Complete Guide',
    'TypeScript Best Practices',
    'Modern Web Development',
    'JavaScript ES2024 Features',
    'React vs Angular Comparison',
    'Node.js Backend Development',
    'Database Design Patterns',
  ];

  ngAfterViewInit() {
    this.setupClickTracking();
    this.setupSearchFunctionality();
    this.setupFormValidation();
    this.setupMouseTracking();
    this.setupUserActivityMonitoring();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Real-world Example 1: Advanced Click Analytics
   * Used in: E-commerce, Digital Marketing, UX Analysis
   */
  private setupClickTracking() {
    const uploadBtnEl = this.uploadBtn?.nativeElement;
    const downloadBtnEl = this.downloadBtn?.nativeElement;

    if (uploadBtnEl && downloadBtnEl) {
      // Track clicks on upload button with analytics
      const uploadClicks$ = fromEvent<MouseEvent>(uploadBtnEl, 'click').pipe(
        map((event) => ({
          timestamp: Date.now(),
          x: event.clientX,
          y: event.clientY,
          element: 'upload-button',
          count: 0,
        })),
        scan((acc, curr) => ({ ...curr, count: acc.count + 1 }), {
          count: 0,
        } as ClickData)
      );

      // Track clicks on download button
      const downloadClicks$ = fromEvent<MouseEvent>(
        downloadBtnEl,
        'click'
      ).pipe(
        map((event) => ({
          timestamp: Date.now(),
          x: event.clientX,
          y: event.clientY,
          element: 'download-button',
          count: 0,
        })),
        scan((acc, curr) => ({ ...curr, count: acc.count + 1 }), {
          count: 0,
        } as ClickData)
      );

      // Merge all click streams for comprehensive analytics
      const allClicks$ = merge(uploadClicks$, downloadClicks$).pipe(
        tap((clickData) => {
          this.logUserActivity({
            type: 'click',
            target: clickData.element,
            timestamp: clickData.timestamp,
            data: {
              coordinates: { x: clickData.x, y: clickData.y },
              count: clickData.count,
            },
          });
        })
      );

      this.subscriptions.push(
        allClicks$.subscribe((clickData) => {
          this.clickHistory.update((history) =>
            [...history, clickData].slice(-10)
          );
          this.totalClicks.update((count) => count + 1);
          this.utility.print(
            `${clickData.element} clicked at (${clickData.x}, ${clickData.y}) - Total: ${clickData.count}`,
            'clickContainer'
          );
        })
      );
    }
  }

  /**
   * Real-world Example 2: Real-time Search with Debouncing
   * Used in: Search engines, Auto-complete, Content filtering
   */
  private setupSearchFunctionality() {
    const searchInputEl = this.searchInput?.nativeElement;

    if (searchInputEl) {
      const searchStream$ = fromEvent<Event>(searchInputEl, 'input').pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        filter((text) => text.length > 2),
        debounceTime(300), // Wait 300ms after user stops typing
        distinctUntilChanged(), // Only emit if value actually changed
        tap(() => this.isSearching.set(true)),
        switchMap((searchTerm) => this.simulateSearch(searchTerm))
      );

      this.subscriptions.push(
        searchStream$.subscribe((results) => {
          this.searchResults.set(results);
          this.isSearching.set(false);
          this.logUserActivity({
            type: 'search',
            target: 'search-input',
            timestamp: Date.now(),
            data: { resultsCount: results.length },
          });
        })
      );
    }
  }

  /**
   * Real-world Example 3: Real-time Form Validation
   * Used in: Registration forms, Contact forms, Data entry
   */
  private setupFormValidation() {
    const emailInputEl = this.emailInput?.nativeElement;

    if (emailInputEl) {
      const emailValidation$ = fromEvent<Event>(emailInputEl, 'input').pipe(
        map((event: Event) => (event.target as HTMLInputElement).value),
        debounceTime(500),
        map((email) => ({
          field: 'email',
          value: email,
          isValid: this.validateEmail(email),
          timestamp: Date.now(),
        }))
      );

      this.subscriptions.push(
        emailValidation$.subscribe((validation) => {
          this.validationStatus.update((status) =>
            [...status.filter((s) => s.field !== 'email'), validation].slice(-5)
          );

          this.emailStatus.set(
            validation.isValid
              ? '✅ Valid email format'
              : validation.value
              ? '❌ Invalid email format'
              : ''
          );

          this.logUserActivity({
            type: 'validation',
            target: 'email-input',
            timestamp: validation.timestamp,
            data: { field: validation.field, isValid: validation.isValid },
          });
        })
      );
    }
  }

  /**
   * Real-world Example 4: Mouse Movement Tracking
   * Used in: Heatmap analytics, User behavior studies, Interactive demos
   */
  private setupMouseTracking() {
    const trackerEl = this.mouseTracker?.nativeElement;

    if (trackerEl) {
      const mouseMove$ = fromEvent<MouseEvent>(trackerEl, 'mousemove').pipe(
        throttleTime(50), // Limit to 20 updates per second
        map((event) => {
          const rect = trackerEl.getBoundingClientRect();
          return {
            x: Math.round(event.clientX - rect.left),
            y: Math.round(event.clientY - rect.top),
          };
        })
      );

      this.subscriptions.push(
        mouseMove$.subscribe((position) => {
          this.mousePosition.set(position);
        })
      );
    }
  }

  /**
   * Real-world Example 5: Comprehensive User Activity Monitoring
   * Used in: Analytics platforms, User research, Performance monitoring
   */
  private setupUserActivityMonitoring() {
    // Track window focus/blur for engagement metrics
    const windowFocus$ = merge(
      fromEvent(window, 'focus').pipe(
        map(() => ({ type: 'focus', active: true }))
      ),
      fromEvent(window, 'blur').pipe(
        map(() => ({ type: 'blur', active: false }))
      )
    );

    this.subscriptions.push(
      windowFocus$.subscribe((event) => {
        this.logUserActivity({
          type: event.type,
          target: 'window',
          timestamp: Date.now(),
          data: { active: event.active },
        });
      })
    );

    // Track keyboard interactions
    const keyboardEvents$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter((event) => ['Enter', 'Tab', 'Escape'].includes(event.key)),
      map((event) => ({
        type: 'keypress',
        target: 'document',
        timestamp: Date.now(),
        data: {
          key: event.key,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
        },
      }))
    );

    this.subscriptions.push(
      keyboardEvents$.subscribe((activity) => {
        this.logUserActivity(activity);
      })
    );
  }

  // Helper Methods
  private simulateSearch(term: string): Promise<string[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = this.sampleVideos.filter((video) =>
          video.toLowerCase().includes(term.toLowerCase())
        );
        resolve(results);
      }, 500);
    });
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private logUserActivity(activity: UserActivity) {
    this.userActivity.update(
      (activities) => [...activities, activity].slice(-20) // Keep last 20 activities
    );
  }

  // Template Helper Methods
  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      click: '🖱️',
      search: '🔍',
      validation: '✅',
      focus: '👁️',
      blur: '😴',
      keypress: '⌨️',
    };
    return icons[type] || '📊';
  }
}
