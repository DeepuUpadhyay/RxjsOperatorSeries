import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin, catchError, finalize, of, tap, delay } from 'rxjs';
import { Router } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  postId: number;
}

interface ApiResponse {
  users: User[];
  posts: Post[];
  comments: Comment[];
}

@Component({
  selector: 'app-fork-join',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fork-join.component.html',
  styleUrls: ['./fork-join.component.css']
})
export class ForkJoinComponent implements OnInit {
  // Modern Angular: Using inject() function instead of constructor injection
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Operator definition and examples for educational purposes
  operatorDefinition = 'ForkJoin waits for all source observables to complete, then emits an array or object of all the last emitted values. Perfect for parallel API calls and batch operations.';

  realLifeExamples = [
    {
      title: 'Parallel API Loading',
      description: 'Load user profile, settings, and notifications simultaneously when app starts',
      code: 'forkJoin({\n  profile: getProfile(),\n  settings: getSettings(),\n  notifications: getNotifications()\n})'
    },
    {
      title: 'Batch File Processing',
      description: 'Process multiple files in parallel and wait for all to complete',
      code: 'forkJoin(\n  files.map(file => processFile(file))\n).subscribe(results => {\n  console.log("All files processed");\n});'
    },
    {
      title: 'Multi-Service Data Sync',
      description: 'Synchronize data across multiple services before proceeding',
      code: 'forkJoin([\n  syncUserData(),\n  syncPreferences(),\n  syncCache()\n]).subscribe(() => {\n  completeSync();\n});'
    }
  ];

  // Using signals for reactive state management
  loading = signal(false);
  users = signal<User[]>([]);
  posts = signal<Post[]>([]);
  comments = signal<Comment[]>([]);
  error = signal<string>('');
  loadingSteps = signal<string[]>([]);

  // Computed signals for derived state
  totalItems = computed(() => 
    this.users().length + this.posts().length + this.comments().length
  );

  hasData = computed(() => this.totalItems() > 0);
  isError = computed(() => this.error().length > 0);

  ngOnInit(): void {
    this.loadDataWithForkJoin();
  }

  // Navigation method for UI
  goBackToDashboard(): void {
    this.router.navigate(['/observable/all']);
  }

  loadDataWithForkJoin(): void {
    this.loading.set(true);
    this.error.set('');
    this.loadingSteps.set(['Starting parallel requests...']);

    // Create multiple HTTP requests with enhanced logging
    const users$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').pipe(
      tap(() => this.updateLoadingSteps('✅ Users loaded successfully')),
      catchError(err => {
        this.updateLoadingSteps('❌ Users failed to load');
        throw err;
      })
    );

    const posts$ = this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5').pipe(
      tap(() => this.updateLoadingSteps('✅ Posts loaded successfully')),
      catchError(err => {
        this.updateLoadingSteps('❌ Posts failed to load');
        throw err;
      })
    );

    const comments$ = this.http.get<Comment[]>('https://jsonplaceholder.typicode.com/comments?_limit=10').pipe(
      tap(() => this.updateLoadingSteps('✅ Comments loaded successfully')),
      catchError(err => {
        this.updateLoadingSteps('❌ Comments failed to load');
        throw err;
      })
    );

    // Use forkJoin to execute all requests in parallel
    forkJoin({
      users: users$,
      posts: posts$,
      comments: comments$
    }).pipe(
      tap(() => this.updateLoadingSteps('🎉 All requests completed!')),
      catchError((error) => {
        console.error('Error in forkJoin:', error);
        this.error.set('Failed to load data. Please check your internet connection.');
        this.updateLoadingSteps('💥 ForkJoin operation failed');
        return of({ users: [], posts: [], comments: [] }); // Return empty data on error
      }),
      finalize(() => {
        this.loading.set(false);
        this.updateLoadingSteps('✨ Operation completed');
      })
    ).subscribe({
      next: (result) => {
        console.log('🚀 All API calls completed via ForkJoin:', result);
        this.users.set(result.users);
        this.posts.set(result.posts);
        this.comments.set(result.comments);
      }
    });
  }

  // Helper method to update loading steps
  private updateLoadingSteps(step: string): void {
    const currentSteps = this.loadingSteps();
    this.loadingSteps.set([...currentSteps, step]);
  }

  // Alternative method using array syntax with modern RxJS patterns
  loadDataWithForkJoinArray(): void {
    this.loading.set(true);
    this.error.set('');
    this.loadingSteps.set(['Starting array-based parallel requests...']);

    const users$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
    const posts$ = this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const comments$ = this.http.get<Comment[]>('https://jsonplaceholder.typicode.com/comments?_limit=10');

    // Using array syntax - results will be in the same order as the array
    forkJoin([users$, posts$, comments$]).pipe(
      tap(() => this.updateLoadingSteps('🎯 Array-based ForkJoin completed')),
      catchError((error) => {
        console.error('Error in forkJoin array:', error);
        this.error.set('Failed to load data with array syntax. Please try again.');
        this.updateLoadingSteps('❌ Array ForkJoin failed');
        return of([[], [], []] as [User[], Post[], Comment[]]);
      }),
      finalize(() => {
        this.loading.set(false);
        this.updateLoadingSteps('✅ Array operation completed');
      })
    ).subscribe({
      next: ([users, posts, comments]) => {
        console.log('🔥 All API calls completed (array syntax)', { users: users.length, posts: posts.length, comments: comments.length });
        this.users.set(users);
        this.posts.set(posts);
        this.comments.set(comments);
      }
    });
  }

  // Demonstration of ForkJoin with mixed observable types
  demonstrateMixedObservables(): void {
    this.loading.set(true);
    this.error.set('');
    this.loadingSteps.set(['Demonstrating mixed observable types...']);

    // Mix of different types of observables
    const apiCall$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
    const timerObs$ = of('Timer completed').pipe(delay(1000));
    const immediateObs$ = of(['immediate', 'data', 'available']);

    forkJoin({
      apiData: apiCall$,
      timerResult: timerObs$,
      immediateData: immediateObs$
    }).pipe(
      tap(() => this.updateLoadingSteps('🌟 Mixed observables demonstration completed')),
      catchError(error => {
        console.error('Mixed observables error:', error);
        this.error.set('Mixed observables demonstration failed');
        return of({ apiData: [], timerResult: '', immediateData: [] });
      }),
      finalize(() => {
        this.loading.set(false);
        this.updateLoadingSteps('🎭 Mixed demo completed');
      })
    ).subscribe({
      next: (result) => {
        console.log('🎪 Mixed observables result:', result);
        this.users.set(result.apiData);
        this.updateLoadingSteps(`📊 Results: API(${result.apiData.length}), Timer(${result.timerResult}), Immediate(${result.immediateData.length})`);
      }
    });
  }

  // New method: Using modern async/await pattern with signals
  async loadDataWithAsyncAwait(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    try {
      const users$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
      const posts$ = this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5');
      const comments$ = this.http.get<Comment[]>('https://jsonplaceholder.typicode.com/comments?_limit=10');

      // Modern approach: using lastValueFrom with forkJoin
      const result = await forkJoin({
        users: users$,
        posts: posts$,
        comments: comments$
      }).toPromise();

      if (result) {
        console.log('All API calls completed (async/await):', result);
        this.users.set(result.users);
        this.posts.set(result.posts);
        this.comments.set(result.comments);
      }
    } catch (error) {
      console.error('Error in async forkJoin:', error);
      this.error.set('Failed to load data. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  // Signal-based methods for UI interactions
  reloadData(): void {
    this.clearLoadingSteps();
    this.loadDataWithForkJoin();
  }

  reloadWithArraySyntax(): void {
    this.clearLoadingSteps();
    this.loadDataWithForkJoinArray();
  }

  reloadWithAsyncAwait(): void {
    this.clearLoadingSteps();
    this.loadDataWithAsyncAwait();
  }

  demonstrateMixed(): void {
    this.clearLoadingSteps();
    this.demonstrateMixedObservables();
  }

  // Method to clear all data
  clearData(): void {
    this.users.set([]);
    this.posts.set([]);
    this.comments.set([]);
    this.error.set('');
    this.clearLoadingSteps();
  }

  // Helper method to clear loading steps
  private clearLoadingSteps(): void {
    this.loadingSteps.set([]);
  }
}
