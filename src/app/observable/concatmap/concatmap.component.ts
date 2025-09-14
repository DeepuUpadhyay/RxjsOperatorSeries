import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { concatAll, concatMap, from, map, of, delay, timer } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-concatmap',
  templateUrl: './concatmap.component.html',
  styleUrls: ['./concatmap.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ConcatmapComponent implements OnInit {
  
  // Operator Definition
  operatorDefinition = `
    ConcatMap: Projects each source value to an Observable and flattens them in sequence. 
    It waits for each inner Observable to complete before processing the next one.
    Formula: concatMap = map + concatAll (with sequential ordering)
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. Sequential File Processing",
      description: "Process files one by one in order. Wait for each file to finish before starting the next.",
      code: `
        fileQueue$.pipe(
          concatMap(file => processFile(file))
        ).subscribe(result => updateProgress(result));
      `
    },
    {
      title: "2. Database Transaction Chain",
      description: "Execute database operations in sequence. Each operation must complete before the next begins.",
      code: `
        userActions$.pipe(
          concatMap(action => executeDBOperation(action))
        ).subscribe(result => confirmTransaction(result));
      `
    },
    {
      title: "3. Animation Sequence",
      description: "Play animations one after another in a specific order without overlapping.",
      code: `
        animationSteps$.pipe(
          concatMap(step => playAnimation(step))
        ).subscribe(() => onAnimationComplete());
      `
    }
  ];

  constructor(private _du: UtilitesService, private router: Router) {}

  ngOnInit() {
    this.basicExample();
    this.realLifeExample1();
    this.realLifeExample2();
    this.realLifeExample3();
  }

  basicExample() {
    this._du.print('=== Basic ConcatMap Example ===', 'elContainer');
    const source = from(['Tech', 'Comedy', 'News']);
    
    // Ex-01 Normal Map (creates nested observables)
    this._du.print('1. Normal Map (nested observables):', 'elContainer');
    source
      .pipe(map((data) => this.getData(data)))
      .subscribe((res) =>
        res.subscribe((res2) => this._du.print(res2, 'elContainer'))
      );
    
    // Ex-02 map + concatAll (manual sequential flattening)
    this._du.print('2. Map + ConcatAll (sequential flattening):', 'elContainer2');
    source
      .pipe(
        map((data) => this.getData(data)),
        concatAll()
      )
      .subscribe((res) => this._du.print(res, 'elContainer2'));
    
    // Ex-03 concatMap (automatic sequential flattening)
    this._du.print('3. ConcatMap (automatic sequential):', 'elContainer3');
    source
      .pipe(concatMap((data) => this.getData(data)))
      .subscribe((res) => this._du.print(res, 'elContainer3'));
  }

  realLifeExample1() {
    this._du.print('=== Real-Life Example 1: Sequential File Processing ===', 'elContainer4');
    
    // Simulate processing files in order
    const files = from(['config.json', 'data.csv', 'report.pdf']);
    
    files.pipe(
      concatMap(fileName => this.simulateFileProcessing(fileName))
    ).subscribe(result => {
      this._du.print(`File processed: ${result}`, 'elContainer4');
    });
  }

  realLifeExample2() {
    this._du.print('=== Real-Life Example 2: Database Operations ===', 'elContainer5');
    
    // Simulate sequential database operations
    const operations = from(['INSERT user', 'UPDATE profile', 'CREATE session']);
    
    operations.pipe(
      concatMap(operation => this.simulateDatabaseOperation(operation))
    ).subscribe(result => {
      this._du.print(`DB Operation: ${result}`, 'elContainer5');
    });
  }

  realLifeExample3() {
    this._du.print('=== Real-Life Example 3: Animation Sequence ===', 'elContainer6');
    
    // Simulate sequential animations
    const animations = from(['fadeIn', 'slideUp', 'bounce']);
    
    animations.pipe(
      concatMap(animation => this.simulateAnimation(animation))
    ).subscribe(result => {
      this._du.print(`Animation: ${result}`, 'elContainer6');
    });
  }

  getData(data: string) {
    return of(data + ' Video Uploaded').pipe(delay(2000));
  }

  // Simulate file processing with different processing times
  simulateFileProcessing(fileName: string) {
    const processingTime = fileName.includes('pdf') ? 3000 : 
                          fileName.includes('csv') ? 2000 : 1000;
    return of(`${fileName} processed successfully`).pipe(delay(processingTime));
  }

  // Simulate database operations with sequential timing
  simulateDatabaseOperation(operation: string) {
    const operationTime = 1500;
    return of(`${operation} completed`).pipe(delay(operationTime));
  }

  // Simulate animations with different durations
  simulateAnimation(animationType: string) {
    const animationDuration = animationType === 'bounce' ? 1200 : 
                             animationType === 'slideUp' ? 800 : 600;
    return of(`${animationType} animation completed`).pipe(delay(animationDuration));
  }

  goBackToDashboard() {
    this.router.navigate(['/observable-operators']);
  }
}
