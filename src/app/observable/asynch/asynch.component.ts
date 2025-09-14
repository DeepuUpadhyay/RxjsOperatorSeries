import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AsyncSubject, Subject, Subscription, timer, map, takeUntil } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-asynch',
  templateUrl: './asynch.component.html',
  styleUrls: ['./asynch.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AsynchComponent implements OnInit, OnDestroy {
  asyncVideo = '';
  private destroy$ = new Subject<void>();

  // Operator Definition
  operatorDefinition = `
    AsyncSubject: A special Subject that only emits the last value when the sequence completes.
    It's perfect for scenarios where you only care about the final result of a long-running process.
    Unlike other Subjects, it waits until completion to emit any values.
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. File Upload Completion",
      description: "Only notify when the entire file upload process is complete with final status.",
      code: `
        uploadResult = new AsyncSubject<UploadStatus>();
        
        // Multiple upload steps
        uploadResult.next('Validating...');
        uploadResult.next('Uploading...');
        uploadResult.next('Processing...');
        uploadResult.next('Upload Complete!');
        uploadResult.complete(); // Only now subscribers get 'Upload Complete!'
      `
    },
    {
      title: "2. Database Transaction Result",
      description: "Get the final transaction result after all operations are completed.",
      code: `
        transactionResult = new AsyncSubject<TransactionStatus>();
        
        // Multiple database operations
        transactionResult.next('Validating data');
        transactionResult.next('Inserting records');
        transactionResult.next('Updating indexes');
        transactionResult.next('Transaction committed');
        transactionResult.complete(); // Subscribers get final result
      `
    },
    {
      title: "3. Report Generation Status",
      description: "Notify components only when the complete report is ready for download.",
      code: `
        reportStatus = new AsyncSubject<ReportResult>();
        
        // Report generation steps
        reportStatus.next('Collecting data');
        reportStatus.next('Formatting report');
        reportStatus.next('Report ready for download');
        reportStatus.complete(); // Only final status is emitted
      `
    }
  ];

  // Demo variables
  asyncSub = 'AsyncSubject emits only the last value when the observable is completed. It will only emit the last value of the observable.';
  
  // Demo AsyncSubjects
  fileProcessingSubject = new AsyncSubject<string>();
  databaseOperationSubject = new AsyncSubject<{operation: string, status: string}>();
  calculationSubject = new AsyncSubject<number>();
  
  // Results tracking
  fileProcessingResult = '';
  databaseResult = '';
  calculationResult = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(private utility: UtilitesService, private router: Router) {}

  ngOnInit() {
    this.utility.asyncVideoEmit.subscribe((res) => {
      console.log(res);
      this.asyncVideo = res;
    });

    this.setupAsyncSubjectExamples();
    this.demonstrateFileProcessing();
    this.demonstrateDatabaseOperation();
    this.demonstrateCalculation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setupAsyncSubjectExamples() {
    this.utility.print('=== AsyncSubject Basic Example ===', 'asyncContainer');
    
    const asyncSubject = new AsyncSubject<string>();
    
    // Subscribe before any emissions
    const subscription = asyncSubject.subscribe(value => {
      this.utility.print(`AsyncSubject emitted: ${value}`, 'asyncContainer');
    });
    
    this.utility.print('Emitting multiple values...', 'asyncContainer');
    
    // Emit multiple values
    setTimeout(() => {
      asyncSubject.next('First value');
      this.utility.print('Sent: First value (not emitted to subscribers yet)', 'asyncContainer');
    }, 1000);
    
    setTimeout(() => {
      asyncSubject.next('Second value');
      this.utility.print('Sent: Second value (not emitted to subscribers yet)', 'asyncContainer');
    }, 2000);
    
    setTimeout(() => {
      asyncSubject.next('Final value');
      this.utility.print('Sent: Final value (not emitted to subscribers yet)', 'asyncContainer');
    }, 3000);
    
    // Complete the subject - only now will the last value be emitted
    setTimeout(() => {
      asyncSubject.complete();
      this.utility.print('AsyncSubject completed - Final value emitted!', 'asyncContainer');
    }, 4000);
    
    this.subscriptions.push(subscription);
  }

  demonstrateFileProcessing() {
    this.utility.print('=== File Processing Demo ===', 'fileContainer');
    
    // Subscribe to file processing updates
    const fileSubscription = this.fileProcessingSubject.subscribe(result => {
      this.fileProcessingResult = result;
      this.utility.print(`File Processing Result: ${result}`, 'fileContainer');
    });
    
    this.subscriptions.push(fileSubscription);
  }

  demonstrateDatabaseOperation() {
    this.utility.print('=== Database Operation Demo ===', 'dbContainer');
    
    // Subscribe to database operation updates
    const dbSubscription = this.databaseOperationSubject.subscribe(result => {
      this.databaseResult = `${result.operation}: ${result.status}`;
      this.utility.print(`Database Result: ${result.operation} - ${result.status}`, 'dbContainer');
    });
    
    this.subscriptions.push(dbSubscription);
  }

  demonstrateCalculation() {
    this.utility.print('=== Long Calculation Demo ===', 'calcContainer');
    
    // Subscribe to calculation result
    const calcSubscription = this.calculationSubject.subscribe(result => {
      this.calculationResult = result;
      this.utility.print(`Calculation Result: ${result}`, 'calcContainer');
    });
    
    this.subscriptions.push(calcSubscription);
  }

  // Interactive demo methods
  startFileProcessing() {
    this.utility.print('Starting file processing...', 'fileContainer');
    
    // Simulate file processing steps
    setTimeout(() => {
      this.fileProcessingSubject.next('Validating file...');
      this.utility.print('Step 1: Validating file (intermediate - not emitted)', 'fileContainer');
    }, 500);
    
    setTimeout(() => {
      this.fileProcessingSubject.next('Uploading file...');
      this.utility.print('Step 2: Uploading file (intermediate - not emitted)', 'fileContainer');
    }, 1500);
    
    setTimeout(() => {
      this.fileProcessingSubject.next('Processing file...');
      this.utility.print('Step 3: Processing file (intermediate - not emitted)', 'fileContainer');
    }, 2500);
    
    setTimeout(() => {
      this.fileProcessingSubject.next('File processing completed successfully!');
      this.utility.print('Step 4: Processing complete (final value - ready to emit)', 'fileContainer');
    }, 3500);
    
    setTimeout(() => {
      this.fileProcessingSubject.complete();
      this.utility.print('File processing AsyncSubject completed!', 'fileContainer');
    }, 4000);
  }

  startDatabaseOperation() {
    this.utility.print('Starting database operation...', 'dbContainer');
    
    // Simulate database operation steps
    setTimeout(() => {
      this.databaseOperationSubject.next({operation: 'Validation', status: 'in progress'});
      this.utility.print('Step 1: Validating data (intermediate)', 'dbContainer');
    }, 500);
    
    setTimeout(() => {
      this.databaseOperationSubject.next({operation: 'Insert', status: 'in progress'});
      this.utility.print('Step 2: Inserting records (intermediate)', 'dbContainer');
    }, 1500);
    
    setTimeout(() => {
      this.databaseOperationSubject.next({operation: 'Update', status: 'in progress'});
      this.utility.print('Step 3: Updating indexes (intermediate)', 'dbContainer');
    }, 2500);
    
    setTimeout(() => {
      this.databaseOperationSubject.next({operation: 'Transaction', status: 'committed successfully'});
      this.utility.print('Step 4: Transaction committed (final value)', 'dbContainer');
    }, 3500);
    
    setTimeout(() => {
      this.databaseOperationSubject.complete();
      this.utility.print('Database operation AsyncSubject completed!', 'dbContainer');
    }, 4000);
  }

  startLongCalculation() {
    this.utility.print('Starting long calculation...', 'calcContainer');
    
    // Simulate complex calculation steps
    const steps = [10, 25, 45, 70, 85, 100];
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        this.calculationSubject.next(step);
        this.utility.print(`Calculation progress: ${step}% (intermediate)`, 'calcContainer');
      }, (index + 1) * 600);
    });
    
    setTimeout(() => {
      this.calculationSubject.complete();
      this.utility.print('Calculation AsyncSubject completed!', 'calcContainer');
    }, steps.length * 600 + 500);
  }

  // Original methods for backward compatibility
  UserData(useValue: string) {
    console.log(useValue);
    this.utility.asyncVideoEmit.next(useValue);
  }

  OnComplete() {
    this.utility.asyncVideoEmit.complete();
  }

  goBackToDashboard() {
    this.router.navigate(['/observable']);
  }
}
