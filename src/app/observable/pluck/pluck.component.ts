import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { from, map, toArray, Subject, takeUntil, of } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-pluck',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pluck.component.html',
  styleUrls: ['./pluck.component.css'],
})
export class PluckComponent implements OnInit, OnDestroy {
  mesg1?: any;
  mesg2?: any;
  mesg3?: any;
  private destroy$ = new Subject<void>();

  // Operator Definition
  operatorDefinition = `
    Pluck: Extracts specific properties from objects in an observable stream.
    It's a shorthand for map that specifically selects nested properties by key path.
    Note: Pluck is deprecated in RxJS 7+ - use map with property access instead.
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. User Profile Data Extraction",
      description: "Extract specific user information from complex user objects.",
      code: `
        // Extract usernames from user objects
        userList$.pipe(
          pluck('profile', 'username')
        ).subscribe(username => 
          this.displayUsername(username));
        
        // Modern approach (RxJS 7+)
        userList$.pipe(
          map(user => user.profile.username)
        ).subscribe(username => 
          this.displayUsername(username));
      `
    },
    {
      title: "2. API Response Processing",
      description: "Extract data from nested API response structures.",
      code: `
        // Extract data from nested API response
        apiResponse$.pipe(
          pluck('data', 'results')
        ).subscribe(results => 
          this.processResults(results));
        
        // Modern equivalent
        apiResponse$.pipe(
          map(response => response.data.results)
        ).subscribe(results => 
          this.processResults(results));
      `
    },
    {
      title: "3. Event Object Property Selection",
      description: "Extract specific properties from DOM events or complex event objects.",
      code: `
        // Extract target value from events
        inputEvents$.pipe(
          pluck('target', 'value')
        ).subscribe(value => 
          this.handleInput(value));
        
        // Modern approach
        inputEvents$.pipe(
          map(event => event.target.value)
        ).subscribe(value => 
          this.handleInput(value));
      `
    }
  ];

  // Enhanced demo data
  employeeData = [
    {
      id: 1,
      name: 'Alice Johnson',
      age: 28,
      skills: ['JavaScript', 'Angular', 'TypeScript'],
      position: 'Senior Developer',
      residence: { 
        country: 'USA', 
        state: 'California',
        city: 'San Francisco',
        address: {
          street: '123 Tech Street',
          zipCode: '94105'
        }
      },
      salary: { base: 120000, bonus: 15000, currency: 'USD' },
      department: 'Engineering'
    },
    {
      id: 2,
      name: 'Bob Smith',
      age: 32,
      skills: ['React', 'Node.js', 'MongoDB'],
      position: 'Full Stack Developer',
      residence: { 
        country: 'USA', 
        state: 'New York',
        city: 'New York',
        address: {
          street: '456 Code Avenue',
          zipCode: '10001'
        }
      },
      salary: { base: 110000, bonus: 12000, currency: 'USD' },
      department: 'Engineering'
    },
    {
      id: 3,
      name: 'Charlie Brown',
      age: 26,
      skills: ['Vue.js', 'Python', 'Docker'],
      position: 'Frontend Developer',
      residence: { 
        country: 'Canada', 
        state: 'Ontario',
        city: 'Toronto',
        address: {
          street: '789 Dev Lane',
          zipCode: 'M5V 3A8'
        }
      },
      salary: { base: 95000, bonus: 8000, currency: 'CAD' },
      department: 'Engineering'
    },
    {
      id: 4,
      name: 'Diana Wilson',
      age: 30,
      skills: ['UX Design', 'Figma', 'Sketch'],
      position: 'UX Designer',
      residence: { 
        country: 'UK', 
        state: 'England',
        city: 'London',
        address: {
          street: '321 Design Road',
          zipCode: 'SW1A 1AA'
        }
      },
      salary: { base: 75000, bonus: 5000, currency: 'GBP' },
      department: 'Design'
    }
  ];

  // Demo results
  extractedNames: string[] = [];
  extractedStates: string[] = [];
  extractedSalaries: any[] = [];
  extractedSkills: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.basicPluckExamples();
    this.demonstrateNestedPluck();
    this.demonstrateModernAlternatives();
    this.demonstrateComplexExtraction();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  basicPluckExamples() {
    console.log('=== Basic Pluck Examples ===');
    
    // Example 1: Extract names
    from(this.employeeData)
      .pipe(
        pluck('name'),
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any) => {
        this.mesg1 = res;
        this.extractedNames = res;
        console.log('Extracted names:', res);
      });

    // Example 2: Extract nested property (state)
    from(this.employeeData)
      .pipe(
        pluck('residence', 'state'), 
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.mesg2 = res;
        this.extractedStates = res;
        console.log('Extracted states:', res);
      });

    // Example 3: Extract skills
    from(this.employeeData)
      .pipe(
        pluck('skills'), 
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe((res: any) => {
        this.mesg3 = res;
        this.extractedSkills = res;
        console.log('Extracted skills:', res);
      });
  }

  demonstrateNestedPluck() {
    console.log('=== Nested Property Extraction ===');
    
    // Extract deeply nested properties
    from(this.employeeData)
      .pipe(
        pluck('residence', 'address', 'zipCode'),
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe(zipCodes => {
        console.log('ZIP Codes:', zipCodes);
      });

    // Extract salary information
    from(this.employeeData)
      .pipe(
        pluck('salary'),
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe(salaries => {
        this.extractedSalaries = salaries;
        console.log('Salary information:', salaries);
      });
  }

  demonstrateModernAlternatives() {
    console.log('=== Modern Alternatives to Pluck ===');
    
    // Modern approach using map
    from(this.employeeData)
      .pipe(
        map(employee => employee.name),
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe(names => {
        console.log('Names (using map):', names);
      });

    // Complex property extraction with map
    from(this.employeeData)
      .pipe(
        map(employee => ({
          name: employee.name,
          location: `${employee.residence.city}, ${employee.residence.state}`,
          totalSalary: employee.salary.base + employee.salary.bonus
        })),
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe(processedData => {
        console.log('Processed employee data:', processedData);
      });
  }

  demonstrateComplexExtraction() {
    console.log('=== Complex Property Extraction ===');
    
    // Extract and transform multiple properties
    from(this.employeeData)
      .pipe(
        map(employee => ({
          id: employee.id,
          fullName: employee.name,
          primarySkill: employee.skills[0],
          country: employee.residence.country,
          baseSalary: employee.salary.base
        })),
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe(summary => {
        console.log('Employee summary:', summary);
      });
  }

  // Interactive demo methods
  extractCustomProperty(property: string) {
    console.log(`=== Extracting ${property} ===`);
    
    if (property === 'departments') {
      from(this.employeeData)
        .pipe(
          pluck('department'),
          toArray(),
          takeUntil(this.destroy$)
        )
        .subscribe(departments => {
          console.log('Departments:', departments);
        });
    } else if (property === 'positions') {
      from(this.employeeData)
        .pipe(
          pluck('position'),
          toArray(),
          takeUntil(this.destroy$)
        )
        .subscribe(positions => {
          console.log('Positions:', positions);
        });
    } else if (property === 'cities') {
      from(this.employeeData)
        .pipe(
          pluck('residence', 'city'),
          toArray(),
          takeUntil(this.destroy$)
        )
        .subscribe(cities => {
          console.log('Cities:', cities);
        });
    }
  }

  demonstrateArrayProperty() {
    console.log('=== Array Property Extraction ===');
    
    // Extract first skill from each employee
    from(this.employeeData)
      .pipe(
        map(employee => employee.skills[0]), // Pluck doesn't work well with array indices
        toArray(),
        takeUntil(this.destroy$)
      )
      .subscribe(primarySkills => {
        console.log('Primary skills:', primarySkills);
      });
  }

  demonstrateConditionalExtraction() {
    console.log('=== Conditional Property Extraction ===');
    
    // Extract properties based on conditions
    from(this.employeeData)
      .pipe(
        map(employee => employee.department === 'Engineering' ? employee.name : null),
        takeUntil(this.destroy$)
      )
      .subscribe(engineerName => {
        if (engineerName) {
          console.log('Engineer:', engineerName);
        }
      });
  }

  goBackToDashboard(): void {
    this.router.navigate(['/observable']);
  }
}
