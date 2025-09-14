import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { forkJoin, catchError, finalize, of } from 'rxjs';

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

  // Using signals for reactive state management
  loading = signal(false);
  users = signal<User[]>([]);
  posts = signal<Post[]>([]);
  comments = signal<Comment[]>([]);
  error = signal<string>('');

  // Computed signals for derived state
  totalItems = computed(() => 
    this.users().length + this.posts().length + this.comments().length
  );

  hasData = computed(() => this.totalItems() > 0);
  isError = computed(() => this.error().length > 0);

  ngOnInit(): void {
    this.loadDataWithForkJoin();
  }

  loadDataWithForkJoin(): void {
    this.loading.set(true);
    this.error.set('');

    // Create multiple HTTP requests
    const users$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
    const posts$ = this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const comments$ = this.http.get<Comment[]>('https://jsonplaceholder.typicode.com/comments?_limit=10');

    // Use forkJoin to execute all requests in parallel
    forkJoin({
      users: users$,
      posts: posts$,
      comments: comments$
    }).pipe(
      catchError((error) => {
        console.error('Error in forkJoin:', error);
        this.error.set('Failed to load data. Please try again.');
        return of({ users: [], posts: [], comments: [] }); // Return empty data on error
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (result) => {
        console.log('All API calls completed:', result);
        this.users.set(result.users);
        this.posts.set(result.posts);
        this.comments.set(result.comments);
      }
    });
  }

  // Alternative method using array syntax with modern RxJS patterns
  loadDataWithForkJoinArray(): void {
    this.loading.set(true);
    this.error.set('');

    const users$ = this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
    const posts$ = this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const comments$ = this.http.get<Comment[]>('https://jsonplaceholder.typicode.com/comments?_limit=10');

    // Using array syntax - results will be in the same order as the array
    forkJoin([users$, posts$, comments$]).pipe(
      catchError((error) => {
        console.error('Error in forkJoin:', error);
        this.error.set('Failed to load data. Please try again.');
        return of([[], [], []] as [User[], Post[], Comment[]]);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: ([users, posts, comments]) => {
        console.log('All API calls completed (array syntax)');
        this.users.set(users);
        this.posts.set(posts);
        this.comments.set(comments);
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
    this.loadDataWithForkJoin();
  }

  reloadWithArraySyntax(): void {
    this.loadDataWithForkJoinArray();
  }

  reloadWithAsyncAwait(): void {
    this.loadDataWithAsyncAwait();
  }

  // Method to clear all data
  clearData(): void {
    this.users.set([]);
    this.posts.set([]);
    this.comments.set([]);
    this.error.set('');
  }
}
