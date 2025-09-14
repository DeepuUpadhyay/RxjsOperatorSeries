import { Component, OnInit, OnDestroy, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { 
  Subscription, 
  filter, 
  from, 
  toArray,
  of,
  fromEvent,
  interval,
  timer,
  Observable,
  combineLatest,
  map,
  debounceTime,
  distinctUntilChanged,
  startWith,
  scan,
  catchError,
  share
} from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user' | 'moderator';
  isActive: boolean;
  department: string;
  salary: number;
  joinDate: Date;
  skills: string[];
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishDate: Date;
  viewCount: number;
  rating: number;
  status: 'draft' | 'review' | 'published' | 'archived';
}

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  description: string;
  date: Date;
  isVerified: boolean;
  riskScore: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isOnSale: boolean;
}

@Component({
  selector: 'app-filter-operator',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './filter-operator.component.html',
  styleUrls: ['./filter-operator.component.css'],
})
export class FilterOperatorComponent implements OnInit, OnDestroy {
  private utility = inject(UtilitesService);
  private http = inject(HttpClient);
  private subscriptions: Subscription[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('priceRangeSlider') priceRangeSlider!: ElementRef;

  // State management with signals
  allUsers = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  allPosts = signal<BlogPost[]>([]);
  moderatedPosts = signal<BlogPost[]>([]);
  allTransactions = signal<Transaction[]>([]);
  filteredTransactions = signal<Transaction[]>([]);
  allProducts = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  
  // Filter controls
  searchTerm = signal('');
  selectedRole = signal<string>('all');
  selectedCategory = signal<string>('all');
  priceRange = signal({ min: 0, max: 1000 });
  showActiveOnly = signal(false);
  minimumRating = signal(0);
  
  // Sample data
  sampleUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@company.com', age: 28, role: 'admin', isActive: true, department: 'IT', salary: 75000, joinDate: new Date('2021-03-15'), skills: ['JavaScript', 'Angular', 'Node.js'] },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', age: 32, role: 'user', isActive: true, department: 'Marketing', salary: 62000, joinDate: new Date('2020-08-22'), skills: ['Marketing', 'Analytics', 'SEO'] },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', age: 25, role: 'moderator', isActive: false, department: 'Support', salary: 45000, joinDate: new Date('2022-01-10'), skills: ['Customer Service', 'Communication'] },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@company.com', age: 29, role: 'user', isActive: true, department: 'Design', salary: 68000, joinDate: new Date('2021-11-05'), skills: ['UI/UX', 'Figma', 'Photoshop'] },
    { id: 5, name: 'Alex Brown', email: 'alex@company.com', age: 35, role: 'admin', isActive: true, department: 'IT', salary: 85000, joinDate: new Date('2019-06-12'), skills: ['Python', 'Django', 'PostgreSQL'] },
    { id: 6, name: 'Emily Davis', email: 'emily@company.com', age: 27, role: 'user', isActive: false, department: 'HR', salary: 55000, joinDate: new Date('2022-04-18'), skills: ['Recruitment', 'Training', 'Management'] }
  ];

  samplePosts: BlogPost[] = [
    { id: 1, title: 'Getting Started with Angular', content: 'A comprehensive guide to Angular development...', author: 'John Doe', category: 'Technology', tags: ['angular', 'typescript', 'web'], isPublished: true, publishDate: new Date('2024-01-15'), viewCount: 1250, rating: 4.5, status: 'published' },
    { id: 2, title: 'Inappropriate Content Example', content: 'This post contains inappropriate language and should be filtered...', author: 'Bad Actor', category: 'Spam', tags: ['spam', 'inappropriate'], isPublished: false, publishDate: new Date('2024-02-01'), viewCount: 12, rating: 1.2, status: 'review' },
    { id: 3, title: 'RxJS Best Practices', content: 'Learn the best practices for using RxJS in your applications...', author: 'Jane Smith', category: 'Technology', tags: ['rxjs', 'javascript', 'observables'], isPublished: true, publishDate: new Date('2024-01-22'), viewCount: 892, rating: 4.7, status: 'published' },
    { id: 4, title: 'Marketing Trends 2024', content: 'Explore the latest marketing trends for 2024...', author: 'Sarah Wilson', category: 'Marketing', tags: ['marketing', 'trends', '2024'], isPublished: true, publishDate: new Date('2024-02-05'), viewCount: 456, rating: 3.8, status: 'published' },
    { id: 5, title: 'Draft Article', content: 'This is a draft article not ready for publication...', author: 'Mike Johnson', category: 'Technology', tags: ['draft'], isPublished: false, publishDate: new Date('2024-02-10'), viewCount: 0, rating: 0, status: 'draft' }
  ];

  sampleTransactions: Transaction[] = [
    { id: 'TXN001', amount: 1500, type: 'credit', category: 'Salary', description: 'Monthly salary', date: new Date('2024-02-01'), isVerified: true, riskScore: 0.1 },
    { id: 'TXN002', amount: 250, type: 'debit', category: 'Groceries', description: 'Weekly grocery shopping', date: new Date('2024-02-03'), isVerified: true, riskScore: 0.2 },
    { id: 'TXN003', amount: 10000, type: 'credit', category: 'Transfer', description: 'Large incoming transfer', date: new Date('2024-02-05'), isVerified: false, riskScore: 0.8 },
    { id: 'TXN004', amount: 75, type: 'debit', category: 'Entertainment', description: 'Movie tickets', date: new Date('2024-02-07'), isVerified: true, riskScore: 0.1 },
    { id: 'TXN005', amount: 5000, type: 'debit', category: 'Investment', description: 'Stock purchase', date: new Date('2024-02-08'), isVerified: true, riskScore: 0.3 },
    { id: 'TXN006', amount: 25, type: 'debit', category: 'Subscription', description: 'Netflix subscription', date: new Date('2024-02-10'), isVerified: true, riskScore: 0.1 }
  ];

  sampleProducts: Product[] = [
    { id: 1, name: 'MacBook Pro 16"', price: 2499, category: 'Electronics', brand: 'Apple', inStock: true, rating: 4.8, reviewCount: 245, isOnSale: false },
    { id: 2, name: 'Samsung Galaxy S24', price: 899, category: 'Electronics', brand: 'Samsung', inStock: true, rating: 4.5, reviewCount: 189, isOnSale: true },
    { id: 3, name: 'Nike Air Max 270', price: 130, category: 'Shoes', brand: 'Nike', inStock: false, rating: 4.3, reviewCount: 67, isOnSale: false },
    { id: 4, name: 'Sony WH-1000XM5', price: 399, category: 'Electronics', brand: 'Sony', inStock: true, rating: 4.9, reviewCount: 334, isOnSale: true },
    { id: 5, name: 'Adidas Ultraboost 22', price: 180, category: 'Shoes', brand: 'Adidas', inStock: true, rating: 4.2, reviewCount: 98, isOnSale: false },
    { id: 6, name: 'iPad Air', price: 599, category: 'Electronics', brand: 'Apple', inStock: true, rating: 4.6, reviewCount: 156, isOnSale: false }
  ];

  ngOnInit() {
    this.setupUserFiltering();
    this.setupContentModeration();
    this.setupTransactionFiltering();
    this.setupProductFiltering();
    this.setupRealTimeFiltering();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Real-world Example 1: User Management Filtering
   * Used in: Admin panels, HR systems, User directories
   */
  private setupUserFiltering() {
    const users$ = of(this.sampleUsers);
    
    // Basic user filtering by role
    const adminUsers$ = users$.pipe(
      map(users => users.filter(user => user.role === 'admin')),
      map(users => users.filter(user => user.isActive))
    );

    this.subscriptions.push(
      adminUsers$.subscribe(admins => {
        this.utility.print(`Found ${admins.length} active admin users`, 'userContainer');
        admins.forEach(admin => {
          this.utility.print(`${admin.name} - ${admin.department} - $${admin.salary.toLocaleString()}`, 'userContainer');
        });
      })
    );

    // Advanced filtering with multiple criteria
    const seniorDevelopers$ = users$.pipe(
      map(users => users.filter(user => 
        user.department === 'IT' && 
        user.age >= 30 && 
        user.skills.some(skill => ['JavaScript', 'Python', 'Angular'].includes(skill))
      ))
    );

    this.subscriptions.push(
      seniorDevelopers$.subscribe(developers => {
        this.filteredUsers.set(developers);
      })
    );

    this.allUsers.set(this.sampleUsers);
  }

  /**
   * Real-world Example 2: Content Moderation System
   * Used in: Social media, Blogging platforms, Comment systems
   */
  private setupContentModeration() {
    const posts$ = of(this.samplePosts);

    // Filter out inappropriate content
    const moderatedPosts$ = posts$.pipe(
      map(posts => posts.filter(post => 
        post.status !== 'review' && 
        !post.tags.includes('spam') && 
        !post.tags.includes('inappropriate') &&
        post.rating > 2.0
      ))
    );

    // Filter high-quality published content
    const qualityPosts$ = posts$.pipe(
      map(posts => posts.filter(post => 
        post.isPublished && 
        post.rating >= 4.0 && 
        post.viewCount > 500 &&
        post.status === 'published'
      ))
    );

    this.subscriptions.push(
      moderatedPosts$.subscribe(posts => {
        this.moderatedPosts.set(posts);
        this.utility.print(`Content moderation: ${posts.length} posts approved`, 'moderationContainer');
      })
    );

    this.subscriptions.push(
      qualityPosts$.subscribe(posts => {
        posts.forEach(post => {
          this.utility.print(`⭐ High-quality: "${post.title}" by ${post.author} (${post.rating}⭐, ${post.viewCount} views)`, 'qualityContainer');
        });
      })
    );

    this.allPosts.set(this.samplePosts);
  }

  /**
   * Real-world Example 3: Financial Transaction Filtering
   * Used in: Banking apps, Payment systems, Fraud detection
   */
  private setupTransactionFiltering() {
    const transactions$ = of(this.sampleTransactions);

    // Filter suspicious transactions
    const suspiciousTransactions$ = transactions$.pipe(
      map(transactions => transactions.filter(txn => 
        !txn.isVerified || 
        txn.riskScore > 0.7 || 
        txn.amount > 5000
      ))
    );

    // Filter verified low-risk transactions
    const safeTransactions$ = transactions$.pipe(
      map(transactions => transactions.filter(txn => 
        txn.isVerified && 
        txn.riskScore < 0.3 && 
        txn.amount < 1000
      ))
    );

    this.subscriptions.push(
      suspiciousTransactions$.subscribe(transactions => {
        this.utility.print(`🚨 ${transactions.length} suspicious transactions flagged`, 'transactionContainer');
        transactions.forEach(txn => {
          this.utility.print(`${txn.id}: $${txn.amount} - Risk: ${(txn.riskScore * 100).toFixed(1)}%`, 'transactionContainer');
        });
      })
    );

    this.subscriptions.push(
      safeTransactions$.subscribe(transactions => {
        this.filteredTransactions.set(transactions);
      })
    );

    this.allTransactions.set(this.sampleTransactions);
  }

  /**
   * Real-world Example 4: E-commerce Product Filtering
   * Used in: Online stores, Product catalogs, Search results
   */
  private setupProductFiltering() {
    const products$ = of(this.sampleProducts);

    // Filter products by multiple criteria
    const electronicsOnSale$ = products$.pipe(
      map(products => products.filter(product => 
        product.category === 'Electronics' && 
        product.isOnSale && 
        product.inStock &&
        product.rating >= 4.0
      ))
    );

    // Filter premium products
    const premiumProducts$ = products$.pipe(
      map(products => products.filter(product => 
        product.price > 500 && 
        product.rating >= 4.5 && 
        product.reviewCount > 100
      ))
    );

    this.subscriptions.push(
      electronicsOnSale$.subscribe(products => {
        this.utility.print(`💰 ${products.length} electronics on sale`, 'productContainer');
        products.forEach(product => {
          this.utility.print(`${product.name} - $${product.price} (${product.rating}⭐)`, 'productContainer');
        });
      })
    );

    this.subscriptions.push(
      premiumProducts$.subscribe(products => {
        this.filteredProducts.set(products);
      })
    );

    this.allProducts.set(this.sampleProducts);
  }

  /**
   * Real-world Example 5: Real-time Data Filtering
   * Used in: Live dashboards, Monitoring systems, Data streams
   */
  private setupRealTimeFiltering() {
    // Simulate real-time data stream
    const dataStream$ = interval(2000).pipe(
      map(index => ({
        id: index,
        value: Math.random() * 100,
        timestamp: new Date(),
        type: ['temperature', 'humidity', 'pressure'][index % 3],
        location: ['Office', 'Warehouse', 'Factory'][index % 3]
      }))
    );

    // Filter critical values
    const criticalValues$ = dataStream$.pipe(
      filter(data => data.value > 80 || data.value < 20),
      map(data => ({
        ...data,
        severity: data.value > 90 || data.value < 10 ? 'high' : 'medium'
      }))
    );

    this.subscriptions.push(
      criticalValues$.subscribe(data => {
        const icon = data.severity === 'high' ? '🚨' : '⚠️';
        this.utility.print(`${icon} ${data.type} at ${data.location}: ${data.value.toFixed(1)}`, 'realtimeContainer');
      })
    );
  }

  // Interactive filtering methods
  filterUsersByRole(role: string) {
    this.selectedRole.set(role);
    const filtered = role === 'all' 
      ? this.sampleUsers
      : this.sampleUsers.filter(user => user.role === role);
    this.filteredUsers.set(filtered);
    this.utility.print(`Filtered to ${filtered.length} users with role: ${role}`, 'userContainer');
  }

  filterProductsByCategory(category: string) {
    this.selectedCategory.set(category);
    const filtered = category === 'all'
      ? this.sampleProducts
      : this.sampleProducts.filter(product => product.category === category);
    this.filteredProducts.set(filtered);
    this.utility.print(`Filtered to ${filtered.length} products in category: ${category}`, 'productContainer');
  }

  filterByPriceRange(min: number, max: number) {
    this.priceRange.set({ min, max });
    const filtered = this.sampleProducts.filter(product => 
      product.price >= min && product.price <= max
    );
    this.filteredProducts.set(filtered);
    this.utility.print(`Found ${filtered.length} products between $${min}-$${max}`, 'productContainer');
  }

  toggleActiveOnly() {
    this.showActiveOnly.update(current => !current);
    const filtered = this.showActiveOnly() 
      ? this.sampleUsers.filter(user => user.isActive)
      : this.sampleUsers;
    this.filteredUsers.set(filtered);
  }

  // Demonstration triggers
  demonstrateAdvancedFiltering() {
    this.utility.print('🔄 Advanced filtering demonstration started', 'demoContainer');
    
    // Complex chained filtering
    of(this.sampleUsers).pipe(
      map(users => users.filter(user => user.isActive)),
      map(users => users.filter(user => user.salary > 60000)),
      map(users => users.filter(user => user.age < 35)),
      map(users => users.sort((a, b) => b.salary - a.salary))
    ).subscribe(results => {
      this.utility.print(`Found ${results.length} high-value active young employees`, 'demoContainer');
      results.forEach(user => {
        this.utility.print(`${user.name}: $${user.salary.toLocaleString()} (${user.age}y, ${user.department})`, 'demoContainer');
      });
    });
  }

  demonstrateContentFiltering() {
    this.utility.print('🔄 Content filtering demonstration started', 'demoContainer');
    
    // Multi-stage content filtering
    of(this.samplePosts).pipe(
      map(posts => posts.filter(post => post.isPublished)),
      map(posts => posts.filter(post => post.rating >= 4.0)),
      map(posts => posts.filter(post => post.viewCount > 400)),
      map(posts => posts.sort((a, b) => b.rating - a.rating))
    ).subscribe(results => {
      this.utility.print(`Found ${results.length} top-quality published articles`, 'demoContainer');
      results.forEach(post => {
        this.utility.print(`"${post.title}" - ${post.rating}⭐ (${post.viewCount} views)`, 'demoContainer');
      });
    });
  }
}
