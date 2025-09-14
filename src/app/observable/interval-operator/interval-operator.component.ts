import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval, timer, fromEvent, merge } from 'rxjs';
import { map, filter, takeWhile, takeUntil, switchMap, startWith, finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  timestamp: Date;
  trend: 'up' | 'down' | 'stable';
}

interface NotificationMessage {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  source: string;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  timestamp: Date;
}

interface RealTimeData {
  activeUsers: number;
  newOrders: number;
  revenue: number;
  timestamp: Date;
}

@Component({
  selector: 'app-interval-operator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './interval-operator.component.html',
  styleUrls: ['./interval-operator.component.css'],
})
export class IntervalOperatorComponent implements OnInit, OnDestroy {
  // Modern Angular: Using inject() function
  private readonly utility = inject(UtilitesService);

  // Using signals for reactive state management
  message = signal<string>('');
  
  // Real-life example 1: Auto-refresh data
  currentTime = signal<Date>(new Date());
  autoRefreshActive = signal<boolean>(false);
  
  // Real-life example 2: Stock price updates
  stockPrices = signal<StockPrice[]>([]);
  stockUpdateActive = signal<boolean>(false);
  
  // Real-life example 3: Notification system
  notifications = signal<NotificationMessage[]>([]);
  notificationActive = signal<boolean>(false);
  
  // Real-life example 4: Progress bar simulation
  progressValue = signal<number>(0);
  progressActive = signal<boolean>(false);
  
  // Real-life example 5: Auto-save feature
  autoSaveCounter = signal<number>(0);
  autoSaveActive = signal<boolean>(false);
  lastSaved = signal<Date | null>(null);
  
  // Real-life example 6: System monitoring
  systemHealth = signal<SystemHealth | null>(null);
  monitoringActive = signal<boolean>(false);
  
  // Real-life example 7: Real-time analytics
  analyticsData = signal<RealTimeData | null>(null);
  analyticsActive = signal<boolean>(false);
  
  // Real-life example 8: Chat/messaging
  newMessages = signal<number>(0);
  chatActive = signal<boolean>(false);

  // Computed signals for derived state
  totalItems = computed(() => 
    this.stockPrices().length + this.notifications().length
  );

  hasActiveFeatures = computed(() => 
    this.autoRefreshActive() || this.stockUpdateActive() || 
    this.notificationActive() || this.progressActive() || 
    this.autoSaveActive() || this.monitoringActive() || 
    this.analyticsActive() || this.chatActive()
  );

  systemStatus = computed(() => {
    const health = this.systemHealth();
    if (!health) return 'unknown';
    const avg = (health.cpu + health.memory + health.disk + health.network) / 4;
    if (avg > 80) return 'critical';
    if (avg > 60) return 'warning';
    return 'healthy';
  });

  private subscriptions: Subscription[] = [];
  private notificationId: number = 1;

  ngOnInit(): void {
    this.initializeBasicExample();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Basic example from original code (modernized)
  initializeBasicExample(): void {
    const videosBroadcast = timer(1000, 2000);
    const videoSub = videosBroadcast.pipe(
      takeWhile(res => res <= 5),
      finalize(() => console.log('Video broadcast completed'))
    ).subscribe((res) => {
      const message = `Video ${res} Uploaded`;
      this.message.set(message);
      console.log(res);
      this.utility.print(message, 'elContainer');
      this.utility.print(message, 'elContainer2');
      this.utility.print(message, 'elContainer3');
    });
    this.subscriptions.push(videoSub);
  }

  // Real-life Example 1: Auto-refresh current time (Dashboard Clock)
  startAutoRefresh(): void {
    if (this.autoRefreshActive()) return;
    
    this.autoRefreshActive.set(true);
    const clockSub = interval(1000).subscribe(() => {
      this.currentTime.set(new Date());
    });
    this.subscriptions.push(clockSub);
  }

  stopAutoRefresh(): void {
    this.autoRefreshActive.set(false);
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  // Real-life Example 2: Stock Price Updates (Financial App)
  startStockUpdates(): void {
    if (this.stockUpdateActive()) return;
    
    this.stockUpdateActive.set(true);
    const stocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META'];
    
    const stockSub = interval(2000).pipe(
      map(() => {
        const symbol = stocks[Math.floor(Math.random() * stocks.length)];
        const basePrice = this.getBasePrice(symbol);
        const change = (Math.random() - 0.5) * 20; // Random change between -10 and +10
        const price = Math.max(basePrice + change, 1); // Ensure price doesn't go negative
        const trend: 'up' | 'down' | 'stable' = change > 1 ? 'up' : change < -1 ? 'down' : 'stable';
        
        return {
          symbol,
          price: Math.round(price * 100) / 100,
          change: Math.round(change * 100) / 100,
          timestamp: new Date(),
          trend
        };
      }),
      catchError(error => {
        console.error('Stock update error:', error);
        return of();
      })
    ).subscribe((stock) => {
      // Update existing stock or add new one using signal update
      this.stockPrices.update(currentPrices => {
        const existingIndex = currentPrices.findIndex(s => s.symbol === stock.symbol);
        let updatedPrices = [...currentPrices];
        
        if (existingIndex >= 0) {
          updatedPrices[existingIndex] = stock;
        } else {
          updatedPrices.push(stock);
        }
        
        // Keep only latest 15 updates
        if (updatedPrices.length > 15) {
          updatedPrices = updatedPrices.slice(-15);
        }
        
        return updatedPrices;
      });
    });
    
    this.subscriptions.push(stockSub);
  }

  stopStockUpdates(): void {
    this.stockUpdateActive.set(false);
    this.stockPrices.set([]);
  }

  // Real-life Example 3: Notification System (Social Media/Apps)
  startNotifications(): void {
    if (this.notificationActive()) return;
    
    this.notificationActive.set(true);
    const messages = [
      { text: 'New message from John', type: 'info' as const, source: 'Chat' },
      { text: 'System backup completed successfully', type: 'success' as const, source: 'System' },
      { text: 'Low disk space warning', type: 'warning' as const, source: 'System' },
      { text: 'Failed to save document', type: 'error' as const, source: 'Editor' },
      { text: 'New user registered', type: 'info' as const, source: 'Users' },
      { text: 'Payment processed successfully', type: 'success' as const, source: 'Payments' },
      { text: 'Server response time is high', type: 'warning' as const, source: 'Monitoring' },
      { text: 'Database connection lost', type: 'error' as const, source: 'Database' },
      { text: 'Email campaign sent', type: 'success' as const, source: 'Marketing' },
      { text: 'Security scan completed', type: 'info' as const, source: 'Security' }
    ];

    const notificationSub = interval(3000).pipe(
      map(() => {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        return {
          id: this.notificationId++,
          message: randomMessage.text,
          type: randomMessage.type,
          timestamp: new Date(),
          source: randomMessage.source
        };
      }),
      catchError(error => {
        console.error('Notification error:', error);
        return of();
      })
    ).subscribe((notification) => {
      this.notifications.update(current => {
        const updated = [notification, ...current];
        
        // Auto-remove notifications after 15 seconds
        setTimeout(() => {
          this.notifications.update(notifications => 
            notifications.filter(n => n.id !== notification.id)
          );
        }, 15000);
        
        // Keep max 8 notifications visible
        return updated.slice(0, 8);
      });
    });
    
    this.subscriptions.push(notificationSub);
  }

  stopNotifications(): void {
    this.notificationActive.set(false);
    this.notifications.set([]);
  }

  // Real-life Example 4: Progress Bar (File Upload/Download)
  startProgress(): void {
    if (this.progressActive()) return;
    
    this.progressActive.set(true);
    this.progressValue.set(0);
    
    const progressSub = interval(200).pipe(
      takeWhile(() => this.progressValue() < 100),
      finalize(() => this.progressActive.set(false))
    ).subscribe(() => {
      this.progressValue.update(current => {
        const increment = Math.random() * 8 + 2; // Random increment between 2-10
        const newValue = current + increment;
        return newValue > 100 ? 100 : Math.round(newValue * 10) / 10;
      });
    });
    
    this.subscriptions.push(progressSub);
  }

  resetProgress(): void {
    this.progressValue.set(0);
    this.progressActive.set(false);
  }

  // Real-life Example 5: Auto-save Feature (Document Editor)
  startAutoSave(): void {
    if (this.autoSaveActive()) return;
    
    this.autoSaveActive.set(true);
    
    const autoSaveSub = interval(5000).subscribe(() => {
      this.autoSaveCounter.update(count => count + 1);
      const now = new Date();
      this.lastSaved.set(now);
      console.log(`Auto-saved at ${now.toLocaleTimeString()}`);
    });
    
    this.subscriptions.push(autoSaveSub);
  }

  stopAutoSave(): void {
    this.autoSaveActive.set(false);
    this.autoSaveCounter.set(0);
  }

  // Real-life Example 6: System Health Monitoring
  startSystemMonitoring(): void {
    if (this.monitoringActive()) return;
    
    this.monitoringActive.set(true);
    
    const monitoringSub = interval(3000).pipe(
      map(() => ({
        cpu: Math.round((Math.random() * 100) * 10) / 10,
        memory: Math.round((Math.random() * 100) * 10) / 10,
        disk: Math.round((Math.random() * 100) * 10) / 10,
        network: Math.round((Math.random() * 100) * 10) / 10,
        timestamp: new Date()
      })),
      catchError(error => {
        console.error('Monitoring error:', error);
        return of();
      })
    ).subscribe((health) => {
      this.systemHealth.set(health);
    });
    
    this.subscriptions.push(monitoringSub);
  }

  stopSystemMonitoring(): void {
    this.monitoringActive.set(false);
    this.systemHealth.set(null);
  }

  // Real-life Example 7: Real-time Analytics Dashboard
  startAnalytics(): void {
    if (this.analyticsActive()) return;
    
    this.analyticsActive.set(true);
    
    const analyticsSub = interval(4000).pipe(
      map(() => ({
        activeUsers: Math.floor(Math.random() * 1000) + 100,
        newOrders: Math.floor(Math.random() * 50) + 5,
        revenue: Math.round((Math.random() * 10000 + 1000) * 100) / 100,
        timestamp: new Date()
      })),
      catchError(error => {
        console.error('Analytics error:', error);
        return of();
      })
    ).subscribe((data) => {
      this.analyticsData.set(data);
    });
    
    this.subscriptions.push(analyticsSub);
  }

  stopAnalytics(): void {
    this.analyticsActive.set(false);
    this.analyticsData.set(null);
  }

  // Real-life Example 8: Chat/Messaging (New Message Counter)
  startChatSimulation(): void {
    if (this.chatActive()) return;
    
    this.chatActive.set(true);
    
    const chatSub = interval(6000).subscribe(() => {
      this.newMessages.update(count => count + Math.floor(Math.random() * 3) + 1);
    });
    
    this.subscriptions.push(chatSub);
  }

  stopChatSimulation(): void {
    this.chatActive.set(false);
    this.newMessages.set(0);
  }

  markMessagesAsRead(): void {
    this.newMessages.set(0);
  }

  // Helper methods
  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'AAPL': 175,
      'GOOGL': 2800,
      'MSFT': 380,
      'TSLA': 850,
      'AMZN': 3400,
      'NVDA': 450,
      'META': 320
    };
    return basePrices[symbol] || 100;
  }

  getNotificationClass(type: string): string {
    return `notification-${type}`;
  }

  removeNotification(id: number): void {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  getProgressColor(): string {
    const value = this.progressValue();
    if (value < 30) return '#dc3545'; // Red
    if (value < 70) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  }

  getSystemHealthColor(): string {
    const status = this.systemStatus();
    switch (status) {
      case 'healthy': return '#28a745';
      case 'warning': return '#ffc107';
      case 'critical': return '#dc3545';
      default: return '#6c757d';
    }
  }

  stopAllFeatures(): void {
    this.stopAutoRefresh();
    this.stopStockUpdates();
    this.stopNotifications();
    this.resetProgress();
    this.stopAutoSave();
    this.stopSystemMonitoring();
    this.stopAnalytics();
    this.stopChatSimulation();
  }
}
