import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { delay, map, retry, retryWhen, scan, take, tap, of, timer, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-retry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './retry.component.html',
  styleUrls: ['./retry.component.css'],
})
export class RetryComponent implements OnInit {
  
  // Operator Definition
  operatorDefinition = `
    Retry: Resubscribes to the source Observable when it encounters an error, attempting the operation again.
    It's essential for handling transient failures like network issues, timeouts, or temporary server errors.
    Variants: retry(count), retryWhen(notifier), catchError for graceful fallbacks
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. API Network Failures",
      description: "Retry failed HTTP requests due to network issues, server timeouts, or temporary unavailability.",
      code: `
        apiCall$.pipe(
          retry(3),
          catchError(err => of('Fallback data'))
        ).subscribe(data => handleData(data));
      `
    },
    {
      title: "2. File Upload Retry",
      description: "Retry file uploads when they fail due to connection issues or server busy status.",
      code: `
        uploadFile$.pipe(
          retryWhen(errors => errors.pipe(
            delay(2000),
            take(3)
          ))
        ).subscribe(result => onUploadSuccess(result));
      `
    },
    {
      title: "3. Database Connection Retry",
      description: "Retry database connections with exponential backoff when connection fails.",
      code: `
        connectDB$.pipe(
          retryWhen(errors => errors.pipe(
            scan((acc, error) => acc * 2, 1000),
            delay(acc => acc),
            take(5)
          ))
        ).subscribe(conn => onConnectionSuccess(conn));
      `
    }
  ];

  users: any;
  lodeData: boolean = false;
  status = 'No Data';
  
  constructor(private http: HttpClient, private router: Router) {}
  
  ngOnInit() {
    this.basicRetryExample();
    this.realLifeExample1();
    this.realLifeExample2();
    this.realLifeExample3();
  }

  basicRetryExample() {
    console.log('=== Basic Retry Example ===');
    // This will be shown in the UI via button click
  }

  realLifeExample1() {
    console.log('=== Real-Life Example 1: API Retry with Fallback ===');
    
    // Simulate unreliable API
    this.simulateUnreliableAPI().pipe(
      retry(2),
      catchError((err: any) => {
        console.log('API failed after retries, using fallback');
        return of('Fallback: Cached data');
      })
    ).subscribe((result: any) => {
      console.log('API Result:', result);
    });
  }

  realLifeExample2() {
    console.log('=== Real-Life Example 2: File Upload Retry ===');
    
    // Simulate file upload with retries
    this.simulateFileUpload().pipe(
      retryWhen(errors => 
        errors.pipe(
          tap((err: any) => console.log('Upload failed, retrying in 2s...')),
          delay(2000),
          take(3)
        )
      ),
      catchError((err: any) => of('Upload failed permanently'))
    ).subscribe((result: any) => {
      console.log('Upload Result:', result);
    });
  }

  realLifeExample3() {
    console.log('=== Real-Life Example 3: Exponential Backoff ===');
    
    // Simulate connection with exponential backoff
    this.simulateConnection().pipe(
      retryWhen(errors => 
        errors.pipe(
          scan((retryCount: number, error: any) => {
            const delayTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.log(`Connection failed, retry ${retryCount + 1} in ${delayTime}ms`);
            if (retryCount >= 3) throw error;
            return retryCount + 1;
          }, 0),
          delay(2000) // Fixed delay value
        )
      ),
      catchError((err: any) => of('Connection failed permanently'))
    ).subscribe((result: any) => {
      console.log('Connection Result:', result);
    });
  }

  // Simulation methods
  simulateUnreliableAPI() {
    return timer(1000).pipe(
      map(() => {
        if (Math.random() < 0.7) { // 70% chance of failure
          throw new Error('API temporarily unavailable');
        }
        return 'API Success: Data retrieved';
      })
    );
  }

  simulateFileUpload() {
    return timer(2000).pipe(
      map(() => {
        if (Math.random() < 0.6) { // 60% chance of failure
          throw new Error('Upload failed: Network error');
        }
        return 'File uploaded successfully';
      })
    );
  }

  simulateConnection() {
    return timer(1500).pipe(
      map(() => {
        if (Math.random() < 0.8) { // 80% chance of failure
          throw new Error('Connection timeout');
        }
        return 'Connected successfully';
      })
    );
  }
  loadApiData() {
    this.lodeData = true;
    this.http.get('https://jsonplaceholder.typicode.com/users').pipe(
      // retry(2),
  retryWhen((error) => error.pipe(
    delay(3000),
    scan((retryCount) => {
      if (retryCount >= 5) {
        throw error;
      } else {
        retryCount = retryCount + 1;
        console.log('retryCount:', retryCount);
        this.status = 'Retry Attempt ' + retryCount;
        return retryCount;
      }
    },0
  ))),
      map((data: any) => data.slice(0, 10))).subscribe(
      (data:any) => {
      this.users = data;
      this.status = 'Data Found';
      this.lodeData = false;
      },
      (error) => {
        this.lodeData = false;
        this.status = 'Error Found';
        console.log(error);
        // if (error.status == 404) {
        //   console.log('404 error found');
        // }
      }
    );
  }

  goBackToDashboard(): void {
    this.router.navigate(['/observable-operators']);
  }
}
