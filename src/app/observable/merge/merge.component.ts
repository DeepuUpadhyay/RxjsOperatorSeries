import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { concat, interval, map, merge, take, timer, of, fromEvent, catchError } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-merge',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './merge.component.html',
  styleUrls: ['./merge.component.css']
})
export class MergeComponent implements OnInit {
  
  // Operator Definition
  operatorDefinition = `
    Merge: Combines multiple observables into a single observable by emitting values from all source observables simultaneously.
    Unlike concat, merge doesn't wait for one observable to complete before subscribing to the next.
    All observables emit concurrently, making it perfect for parallel operations.
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. Multiple API Sources",
      description: "Combine data from different real APIs simultaneously - users, posts, and comments from JSONPlaceholder.",
      code: `
        merge(
          http.get('/users?_limit=3'),
          http.get('/posts?_limit=2'), 
          http.get('/comments?_limit=2')
        ).subscribe(data => console.log(data));
      `
    },
    {
      title: "2. Event Stream Merging",
      description: "Listen to multiple DOM events at once, like clicks, touches, and keyboard events for user interaction.",
      code: `
        merge(
          fromEvent(element, 'click'),
          fromEvent(element, 'touchstart'),
          fromEvent(document, 'keydown')
        ).subscribe(event => handleUserInput(event));
      `
    },
    {
      title: "3. Real-time Data Sources",
      description: "Merge different types of real-time data sources like weather, news, and stock prices from public APIs.",
      code: `
        merge(
          weatherAPI$,
          newsAPI$,
          stockAPI$
        ).subscribe(update => processRealTimeData(update));
      `
    }
  ];

  merges!: string;
  techVideos: string[] = [];
  comedyVideos: string[] = [];
  newsVideos: string[] = [];
  allMergedVideos: string[] = [];
  
  // Demo properties
  isDemo1Running = false;
  isDemo2Running = false;
  demo1Results: string[] = [];
  demo2Results: string[] = [];

  constructor(private utility: UtilitesService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.basicExample();
  }

  basicExample() {
    // Clear previous results
    this.allMergedVideos = [];
    
    const source = interval(4000).pipe(
      map((val) => `Video Tech #: ${val + 1}`),
      take(5)
    );
    const source2 = interval(8000).pipe(
      map((val) => `Video Comedy #: ${val + 1}`),
      take(3)
    );
    const source3 = interval(12000).pipe(
      map((val) => `Video News #: ${val + 1}`),
      take(2)
    );

    this.merges = 'Merge operator combines multiple observables into one. All observables emit concurrently!';
    
    const finalObs = merge(source, source2, source3);
    finalObs.subscribe((val) => {
      this.allMergedVideos.push(val);
      this.utility.print(val, 'elContainer');
    });
  }

  startDemo1() {
    this.isDemo1Running = true;
    this.demo1Results = [];
    
    // Simulate fast and slow data sources
    const fastSource = timer(0, 1000).pipe(
      map(i => `Fast: ${i + 1}`),
      take(5)
    );
    
    const slowSource = timer(2000, 3000).pipe(
      map(i => `Slow: ${i + 1}`),
      take(3)
    );
    
    merge(fastSource, slowSource).subscribe({
      next: (value) => this.demo1Results.push(value),
      complete: () => this.isDemo1Running = false
    });
  }

  startDemo2() {
    this.isDemo2Running = true;
    this.demo2Results = [];
    
    console.log('🚀 Starting Real API Demo with Merge Operator...');
    
    // Real API calls to JSONPlaceholder (free testing API)
    const usersAPI = this.http.get<any[]>('https://jsonplaceholder.typicode.com/users?_limit=3').pipe(
      map(users => `✅ Users API: Loaded ${users.length} users (${users.map(u => u.name).join(', ')})`),
      catchError(err => of('❌ Users API: Failed to load'))
    );
    
    const postsAPI = this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts?_limit=2').pipe(
      map(posts => `✅ Posts API: Loaded ${posts.length} posts`),
      catchError(err => of('❌ Posts API: Failed to load'))
    );
    
    const commentsAPI = this.http.get<any[]>('https://jsonplaceholder.typicode.com/comments?_limit=2').pipe(
      map(comments => `✅ Comments API: Loaded ${comments.length} comments`),
      catchError(err => of('❌ Comments API: Failed to load'))
    );
    
    // Merge all three real API calls - they run simultaneously!
    console.log('📡 Making 3 parallel API calls...');
    merge(usersAPI, postsAPI, commentsAPI).subscribe({
      next: (result) => {
        console.log('📥 API Response:', result);
        this.demo2Results.push(result);
      },
      complete: () => {
        console.log('✨ All APIs completed!');
        this.isDemo2Running = false;
      },
      error: (err) => {
        console.error('💥 Error in merge:', err);
        this.demo2Results.push('❌ Error occurred in API calls');
        this.isDemo2Running = false;
      }
    });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/observable']);
  }
}
