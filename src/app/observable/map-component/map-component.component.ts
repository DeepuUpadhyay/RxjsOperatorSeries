import { Component, OnInit, OnDestroy, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { 
  Subscription, 
  from, 
  interval, 
  of, 
  fromEvent,
  timer,
  Observable,
  catchError
} from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

interface User {
  id: number;
  name: string;
  email: string;
  address?: {
    street: string;
    city: string;
    zipcode: string;
  };
  company?: {
    name: string;
    catchPhrase: string;
  };
}

interface TransformedUser {
  id: number;
  fullName: string;
  contactEmail: string;
  location: string;
  workplace: string;
  bio: string;
  avatar: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface TransformedProduct {
  id: number;
  name: string;
  formattedPrice: string;
  categoryTag: string;
  shortDescription: string;
  ratingDisplay: string;
  availability: string;
  popularity: string;
}

interface SearchSuggestion {
  query: string;
  suggestions: string[];
  timestamp: number;
}

interface PriceData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  formattedPrice: string;
  formattedChange: string;
  formattedPercent: string;
  formattedVolume: string;
  trend: string;
  color: string;
}

@Component({
  selector: 'app-map-component',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.css'],
})
export class MapComponentComponent implements OnInit, OnDestroy {
  private utility = inject(UtilitesService);
  private http = inject(HttpClient);
  private subscriptions: Subscription[] = [];

  @ViewChild('searchInput') searchInput!: ElementRef;

  // State management with signals
  users = signal<TransformedUser[]>([]);
  products = signal<TransformedProduct[]>([]);
  transformedData = signal<any[]>([]);
  searchSuggestions = signal<string[]>([]);
  priceUpdates = signal<PriceData[]>([]);
  currentSearch = signal('');
  isLoading = signal(false);
  
  // Example data for demonstrations
  sampleUsers = signal<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com' },
  ]);

  ngOnInit() {
    this.setupDataTransformation();
    this.setupApiResponseMapping();
    this.setupSearchSuggestions();
    this.setupPriceTransformation();
    this.setupComplexDataMapping();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Real-world Example 1: Basic Data Transformation
   * Used in: User profile formatting, Data presentation, UI display
   * Logic moved to TypeScript methods instead of RxJS map operator
   */
  private setupDataTransformation() {
    // Transform user data using TypeScript methods
    const rawUsers = this.sampleUsers();
    const transformedUsers = this.transformUserData(rawUsers);
    
    this.transformedData.set(transformedUsers);
    this.utility.print(`Transformed ${transformedUsers.length} users`, 'transformContainer');

    // Number transformation example using TypeScript
    const numberSubscription = interval(1000).subscribe(num => {
      const transformedNumber = this.transformNumberData(num);
      this.utility.print(`${transformedNumber.formatted}: ${transformedNumber.currency}`, 'numberContainer');
    });

    this.subscriptions.push(numberSubscription);
  }

  /**
   * TypeScript transformation method for user data
   */
  private transformUserData(users: User[]): any[] {
    return users.map(user => ({
      ...user,
      displayName: `${user.name} (${user.email})`,
      initials: user.name.split(' ').map(n => n[0]).join(''),
      domain: user.email.split('@')[1]
    }));
  }

  /**
   * TypeScript transformation method for number data
   */
  private transformNumberData(num: number) {
    return {
      original: num,
      squared: num * num,
      formatted: `#${String(num).padStart(3, '0')}`,
      percentage: `${(num * 10)}%`,
      currency: `$${(num * 25.99).toFixed(2)}`
    };
  }

  /**
   * Real-world Example 2: API Response Mapping
   * Used in: REST API integration, Data normalization, Backend communication
   * Logic moved to TypeScript methods instead of RxJS map operator
   */
  private setupApiResponseMapping() {
    // Simulate API calls with TypeScript transformation
    const sampleApiUsers: User[] = [
      { 
        id: 1, 
        name: 'John Doe', 
        email: 'john@company.com',
        address: { street: '123 Main St', city: 'New York', zipcode: '10001' },
        company: { name: 'Tech Corp', catchPhrase: 'Innovation First' }
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        email: 'jane@startup.com',
        address: { street: '456 Oak Ave', city: 'San Francisco', zipcode: '94102' },
        company: { name: 'Startup Inc', catchPhrase: 'Move Fast' }
      }
    ];

    const apiUsers$ = this.simulateApiCall<User[]>(sampleApiUsers);

    this.subscriptions.push(
      apiUsers$.subscribe(users => {
        const mappedUsers = this.transformApiUserData(users);
        this.users.set(mappedUsers);
        mappedUsers.forEach(user => {
          this.utility.print(`${user.bio}`, 'apiContainer');
        });
      })
    );

    // Product data transformation using TypeScript
    const sampleProducts: Product[] = [
      {
        id: 1,
        title: 'Laptop Pro',
        price: 1299.99,
        category: 'electronics',
        description: 'High-performance laptop for professionals',
        image: 'laptop.jpg',
        rating: { rate: 4.5, count: 120 }
      },
      {
        id: 2,
        title: 'Wireless Headphones',
        price: 199.99,
        category: 'electronics',
        description: 'Premium noise-canceling headphones',
        image: 'headphones.jpg',
        rating: { rate: 4.3, count: 89 }
      }
    ];

    const products$ = this.simulateApiCall<Product[]>(sampleProducts);

    this.subscriptions.push(
      products$.subscribe(products => {
        const mappedProducts = this.transformProductData(products);
        this.products.set(mappedProducts);
      })
    );
  }

  /**
   * TypeScript transformation method for API user data
   */
  private transformApiUserData(users: User[]): TransformedUser[] {
    return users.map(user => ({
      id: user.id,
      fullName: user.name,
      contactEmail: user.email,
      location: `${user.address?.city}, ${user.address?.zipcode}`,
      workplace: user.company?.name || 'Freelancer',
      bio: `${user.name} works at ${user.company?.name || 'Freelance'} in ${user.address?.city}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name.replace(' ', '')}`
    }));
  }

  /**
   * TypeScript transformation method for product data
   */
  private transformProductData(products: Product[]): TransformedProduct[] {
    return products.map(product => ({
      id: product.id,
      name: product.title,
      formattedPrice: `$${product.price.toLocaleString()}`,
      categoryTag: product.category.toUpperCase(),
      shortDescription: product.description.substring(0, 50) + '...',
      ratingDisplay: `⭐ ${product.rating.rate} (${product.rating.count} reviews)`,
      availability: product.rating.count > 50 ? 'In Stock' : 'Limited Stock',
      popularity: product.rating.count > 100 ? 'Popular' : 'New'
    }));
  }

  /**
   * Real-world Example 3: Search Suggestions Mapping
   * Used in: Auto-complete, Search engines, Type-ahead functionality
   * Logic moved to TypeScript methods instead of RxJS map operator
   */
  private setupSearchSuggestions() {
    // Simulate search suggestions using TypeScript
    const searchTerms = [
      'angular', 'react', 'vue', 'javascript', 'typescript',
      'rxjs', 'observables', 'promises', 'async', 'await',
      'node', 'express', 'mongodb', 'postgresql', 'mysql'
    ];

    const searchSubscription = timer(0, 2000).subscribe(index => {
      const searchData = this.generateSearchSuggestions(searchTerms, index);
      this.currentSearch.set(searchData.query);
      this.searchSuggestions.set(searchData.suggestions);
      this.utility.print(`"${searchData.query}" → ${searchData.suggestions.length} suggestions`, 'searchContainer');
    });

    this.subscriptions.push(searchSubscription);
  }

  /**
   * TypeScript method for generating search suggestions
   */
  private generateSearchSuggestions(searchTerms: string[], index: number): SearchSuggestion {
    const query = searchTerms[index % searchTerms.length];
    return {
      query,
      suggestions: searchTerms
        .filter(term => term.includes(query.substring(0, 3)))
        .slice(0, 5),
      timestamp: Date.now()
    };
  }

  /**
   * Real-world Example 4: Financial Data Transformation
   * Used in: Trading platforms, Investment apps, Financial dashboards
   * Logic moved to TypeScript methods instead of RxJS map operator
   */
  private setupPriceTransformation() {
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    
    const priceSubscription = interval(3000).subscribe(index => {
      const rawPriceData = this.generateRawPriceData(symbols, index);
      const formattedPrice = this.transformPriceData(rawPriceData);
      
      this.priceUpdates.update(prices => [...prices, formattedPrice].slice(-5));
      this.utility.print(`${formattedPrice.symbol}: ${formattedPrice.formattedPrice} ${formattedPrice.trend}`, 'priceContainer');
    });

    this.subscriptions.push(priceSubscription);
  }

  /**
   * TypeScript method for generating raw price data
   */
  private generateRawPriceData(symbols: string[], index: number) {
    const symbol = symbols[index % symbols.length];
    const basePrice = 100 + (index * 50);
    const randomChange = (Math.random() - 0.5) * 10;
    const price = basePrice + randomChange;
    
    return {
      symbol,
      price: Math.round(price * 100) / 100,
      change: Math.round(randomChange * 100) / 100,
      changePercent: Math.round((randomChange / basePrice) * 10000) / 100,
      volume: Math.floor(Math.random() * 1000000) + 100000
    };
  }

  /**
   * TypeScript method for transforming price data
   */
  private transformPriceData(priceData: any): PriceData {
    return {
      ...priceData,
      formattedPrice: `$${priceData.price.toFixed(2)}`,
      formattedChange: `${priceData.change >= 0 ? '+' : ''}${priceData.change.toFixed(2)}`,
      formattedPercent: `${priceData.changePercent >= 0 ? '+' : ''}${priceData.changePercent.toFixed(2)}%`,
      formattedVolume: priceData.volume.toLocaleString(),
      trend: priceData.change >= 0 ? '📈' : '📉',
      color: priceData.change >= 0 ? 'green' : 'red'
    };
  }

  /**
   * Real-world Example 5: Complex Nested Data Mapping
   * Used in: E-commerce, CMS, Complex data structures
   * Logic moved to TypeScript methods instead of RxJS map operator
   */
  private setupComplexDataMapping() {
    const complexOrderData = [
      {
        order: {
          id: 'ORD-001',
          customer: { name: 'John Doe', tier: 'premium' },
          items: [
            { product: 'Laptop', quantity: 1, price: 1299.99 },
            { product: 'Mouse', quantity: 2, price: 29.99 }
          ],
          shipping: { method: 'express', cost: 15.99 },
          date: new Date('2024-01-15')
        }
      },
      {
        order: {
          id: 'ORD-002',
          customer: { name: 'Jane Smith', tier: 'standard' },
          items: [
            { product: 'Headphones', quantity: 1, price: 199.99 },
            { product: 'Cable', quantity: 3, price: 12.99 }
          ],
          shipping: { method: 'standard', cost: 8.99 },
          date: new Date('2024-01-16')
        }
      }
    ];

    const complexData$ = of(complexOrderData);

    this.subscriptions.push(
      complexData$.subscribe(orders => {
        const mappedOrders = this.transformComplexOrderData(orders);
        mappedOrders.forEach(order => {
          this.utility.print(
            `${order.orderId}: ${order.customerName} - ${order.total} (${order.itemSummary})`, 
            'orderContainer'
          );
        });
      })
    );
  }

  /**
   * TypeScript method for transforming complex order data
   */
  private transformComplexOrderData(orders: any[]) {
    return orders.map(({ order }) => {
      const subtotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const total = subtotal + order.shipping.cost;
      
      return {
        orderId: order.id,
        customerName: order.customer.name,
        customerTier: order.customer.tier.toUpperCase(),
        itemCount: order.items.length,
        itemSummary: order.items.map((item: any) => `${item.quantity}x ${item.product}`).join(', '),
        subtotal: `$${subtotal.toFixed(2)}`,
        shipping: `$${order.shipping.cost.toFixed(2)} (${order.shipping.method})`,
        total: `$${total.toFixed(2)}`,
        formattedDate: order.date.toLocaleDateString(),
        priority: order.customer.tier === 'premium' ? '🌟 High' : '📦 Normal'
      };
    });
  }

  // Helper method to simulate API calls (without map operator)
  private simulateApiCall<T>(data: T): Observable<T> {
    return new Observable<T>(observer => {
      setTimeout(() => {
        observer.next(data);
        observer.complete();
      }, 1000);
    }).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return of(data);
      })
    );
  }

  // Template helper methods
  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString();
  }

  // Manual trigger methods for demonstrations
  triggerDataTransform() {
    this.utility.print('🔄 TypeScript data transformation triggered!', 'transformContainer');
    this.setupDataTransformation();
  }

  triggerApiMapping() {
    this.utility.print('🔄 TypeScript API mapping triggered!', 'apiContainer');
    this.setupApiResponseMapping();
  }

  triggerComplexMapping() {
    this.utility.print('🔄 TypeScript complex mapping triggered!', 'orderContainer');
    this.setupComplexDataMapping();
  }
}
