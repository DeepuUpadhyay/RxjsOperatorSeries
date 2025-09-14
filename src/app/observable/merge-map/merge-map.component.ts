import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { from, map, merge, mergeAll, mergeMap, of, delay, timer } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-merge-map',
  templateUrl: './merge-map.component.html',
  styleUrls: ['./merge-map.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MergeMapComponent implements OnInit {
  
  // Operator Definition
  operatorDefinition = `
    MergeMap: Projects each source value to an Observable which is merged in the output Observable. 
    It flattens inner observables and executes them concurrently (in parallel).
    Formula: mergeMap = map + mergeAll
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. Search API Calls",
      description: "When user types in search box, each keystroke can trigger API call. MergeMap allows multiple API calls to run in parallel.",
      code: `
        searchInput$.pipe(
          mergeMap(query => searchAPI(query))
        ).subscribe(results => displayResults(results));
      `
    },
    {
      title: "2. File Upload Progress",
      description: "Uploading multiple files simultaneously and tracking their progress independently.",
      code: `
        selectedFiles$.pipe(
          mergeMap(file => uploadFile(file))
        ).subscribe(progress => updateProgress(progress));
      `
    }
  ];

  constructor(private utility: UtilitesService, private router: Router) {}

  //Flatten observable are used to flatten the observable of observable to single observable.
  ngOnInit(): void {
    this.basicExample();
    this.realLifeExample1();
    this.realLifeExample2();
  }

  basicExample() {
    this.utility.print('=== Basic MergeMap Example ===', 'elContainer');
    const source = from(['Tech', 'Comedy', 'News']);
    
    // Ex-01 Normal Map (creates nested observables)
    this.utility.print('1. Normal Map (nested observables):', 'elContainer');
    source
      .pipe(map((data) => this.getData(data)))
      .subscribe((res) =>
        res.subscribe((res2) => this.utility.print(res2, 'elContainer'))
      );
    
    // Ex-02 map + mergeAll (manual flattening)
    this.utility.print('2. Map + MergeAll (manual flattening):', 'elContainer2');
    source
      .pipe(
        map((data) => this.getData(data)),
        mergeAll()
      )
      .subscribe((res) => this.utility.print(res, 'elContainer2'));
    
    // Ex-03 mergeMap (automatic flattening)
    this.utility.print('3. MergeMap (automatic flattening):', 'elContainer3');
    source.pipe(mergeMap((data) => this.getData(data)))
      .subscribe((res) => this.utility.print(res, 'elContainer3')); 
  }

  realLifeExample1() {
    this.utility.print('=== Real-Life Example 1: Parallel API Calls ===', 'elContainer4');
    
    // Simulate search queries
    const searchQueries = from(['angular', 'rxjs', 'typescript']);
    
    searchQueries.pipe(
      mergeMap(query => this.simulateAPICall(query))
    ).subscribe(result => {
      this.utility.print(`Search result: ${result}`, 'elContainer4');
    });
  }

  realLifeExample2() {
    this.utility.print('=== Real-Life Example 2: File Processing ===', 'elContainer5');
    
    // Simulate multiple files being processed
    const files = from(['document.pdf', 'image.jpg', 'video.mp4']);
    
    files.pipe(
      mergeMap(fileName => this.simulateFileProcessing(fileName))
    ).subscribe(result => {
      this.utility.print(`File processed: ${result}`, 'elContainer5');
    });
  }
  getData(data: string) {
    return of(data + ' Video Uploaded'); // of is used to convert any data into observable
  }

  // Simulate API call with random delay
  simulateAPICall(query: string) {
    const randomDelay = Math.random() * 2000 + 500; // 500ms to 2.5s
    return of(`API Response for "${query}"`).pipe(delay(randomDelay));
  }

  // Simulate file processing with different delays
  simulateFileProcessing(fileName: string) {
    const processingTime = fileName.includes('video') ? 3000 : 
                          fileName.includes('image') ? 1500 : 1000;
    return of(`${fileName} processed successfully`).pipe(delay(processingTime));
  }

  goBackToDashboard() {
    this.router.navigate(['/observable-operators']);
  }
}
