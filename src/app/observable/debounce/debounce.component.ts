import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, map, timer, Subject } from 'rxjs';

@Component({
  selector: 'app-debounce',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './debounce.component.html',
  styleUrls: ['./debounce.component.css'],
})
export class DebounceComponent implements AfterViewInit {
  
  // Operator Definition
  operatorDefinition = `
    DebounceTime: Delays emissions from the source Observable until a specified time has passed without another emission.
    It's perfect for handling rapid user inputs like search typing, button clicks, or scroll events.
    Prevents excessive API calls and improves performance by waiting for user to "pause" their input.
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. Search Autocomplete",
      description: "Wait for user to stop typing before making API calls. Prevents hammering the server with every keystroke.",
      code: `
        searchInput$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(query => searchAPI(query))
        ).subscribe(results => showSuggestions(results));
      `
    },
    {
      title: "2. Auto-Save Forms",
      description: "Save form data only after user stops typing for a few seconds. Prevents excessive save operations.",
      code: `
        formChanges$.pipe(
          debounceTime(2000),
          tap(() => console.log('Auto-saving...')),
          switchMap(formData => saveFormAPI(formData))
        ).subscribe(() => showSavedMessage());
      `
    },
    {
      title: "3. Scroll Event Optimization",
      description: "Handle scroll events efficiently by debouncing rapid scroll movements.",
      code: `
        scroll$.pipe(
          debounceTime(100),
          map(() => window.scrollY),
          distinctUntilChanged()
        ).subscribe(scrollPos => updateScrollIndicator(scrollPos));
      `
    }
  ];

  @ViewChild('searchBox', { static: false }) searchInput!: ElementRef;
  @ViewChild('searchBox2', { static: false }) search2!: ElementRef;
  searchData: any;
  serchData2: any;
  
  // Demo properties
  buttonClickCount = 0;
  debouncedClickCount = 0;
  buttonClicks = new Subject<void>();
  
  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.basicExample();
    this.setupButtonDebounceDemo();
  }

  basicExample() {
    // Original search example
    const search = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(500)
    );
    search.subscribe((data) => {
      this.searchData = data;
    });
    
    // Distinct Until Changed example
    const search2 = fromEvent(this.search2.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(500),
      distinctUntilChanged()
    );
    search2.subscribe((data) => {
      this.serchData2 = data;
    });
  }

  setupButtonDebounceDemo() {
    // Button click debounce demo
    this.buttonClicks.pipe(
      debounceTime(1000)
    ).subscribe(() => {
      this.debouncedClickCount++;
    });
  }

  simulateRapidClicks() {
    // Simulate rapid button clicks
    this.buttonClickCount++;
    this.buttonClicks.next();
  }

  simulateAutoSave() {
    console.log('Simulating auto-save with debounce...');
    timer(2000).subscribe(() => {
      console.log('Form auto-saved!');
    });
  }

  goBack() {
    this.router.navigate(['/observable']);
  }
}
