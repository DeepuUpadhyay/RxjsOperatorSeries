import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, interval, takeUntil, Subscription } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';
import { Comp1Component } from '../comp1/comp1.component';
import { Comp2Component } from '../comp2/comp2.component';
import { Comp3Component } from '../comp3/comp3.component';

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [CommonModule, Comp1Component, Comp2Component, Comp3Component],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit, OnDestroy {
  userNameLatest!: string;
  private destroy$ = new Subject<void>();

  // Operator Definition
  operatorDefinition = `
    Subject: A special type of Observable that allows values to be multicasted to many Observers.
    Unlike regular Observables, Subjects can act as both Observable and Observer.
    They can emit values and be subscribed to simultaneously.
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. Event Bus Communication",
      description: "Share events between components without direct parent-child relationships.",
      code: `
        // Service
        eventBus = new Subject<string>();
        
        // Component A
        this.eventBus.next('User logged in');
        
        // Component B
        this.eventBus.subscribe(event => 
          console.log(event));
      `
    },
    {
      title: "2. Form Validation Notifications",
      description: "Broadcast form validation results to multiple UI components.",
      code: `
        validationSubject = new Subject<ValidationResult>();
        
        validateForm() {
          const result = this.validate();
          this.validationSubject.next(result);
        }
        
        // Multiple components listen
        this.validationSubject.subscribe(result => 
          this.updateUI(result));
      `
    },
    {
      title: "3. Real-time Chat Messages",
      description: "Distribute incoming chat messages to all connected chat components.",
      code: `
        messageSubject = new Subject<Message>();
        
        // Receive from WebSocket
        websocket.onMessage = (msg) => {
          this.messageSubject.next(msg);
        }
        
        // Multiple chat windows subscribe
        this.messageSubject.subscribe(msg => 
          this.displayMessage(msg));
      `
    }
  ];

  // Demo results
  subjectMessages: string[] = [];
  notificationSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(private utility: UtilitesService, private router: Router) {
    this.utility.userNames.subscribe((name) => {
      this.userNameLatest = name;
    });
  }

  ngOnInit() {
    this.utility.exclusive.next(true);
    this.setupBasicExample();
    this.setupRealLifeExamples();
  }

  ngOnDestroy() {
    this.utility.exclusive.next(false);
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  setupBasicExample() {
    // Basic Subject demonstration
    this.utility.print('=== Basic Subject Example ===', 'subjectContainer');
    
    const subject = new Subject<number>();
    
    // First subscriber
    const subscription1 = subject.subscribe(value => {
      this.utility.print(`Subscriber 1 received: ${value}`, 'subjectContainer');
    });

    // Second subscriber
    const subscription2 = subject.subscribe(value => {
      this.utility.print(`Subscriber 2 received: ${value}`, 'subjectContainer');
    });

    // Emit values
    setTimeout(() => subject.next(1), 1000);
    setTimeout(() => subject.next(2), 2000);
    setTimeout(() => subject.next(3), 3000);
    setTimeout(() => subject.complete(), 4000);

    this.subscriptions.push(subscription1, subscription2);
  }

  setupRealLifeExamples() {
    this.setupNotificationSystem();
    this.setupEventBusDemo();
    this.setupChatDemo();
  }

  setupNotificationSystem() {
    this.utility.print('=== Real-Life Example 1: Notification System ===', 'notificationContainer');
    
    // Multiple components listening to notifications
    const notificationSub1 = this.notificationSubject.subscribe(message => {
      this.utility.print(`📱 Mobile App: ${message}`, 'notificationContainer');
    });

    const notificationSub2 = this.notificationSubject.subscribe(message => {
      this.utility.print(`🖥️ Desktop App: ${message}`, 'notificationContainer');
    });

    const notificationSub3 = this.notificationSubject.subscribe(message => {
      this.utility.print(`📧 Email Service: ${message}`, 'notificationContainer');
    });

    this.subscriptions.push(notificationSub1, notificationSub2, notificationSub3);
  }

  setupEventBusDemo() {
    this.utility.print('=== Real-Life Example 2: Event Bus ===', 'eventBusContainer');
    
    const eventBus = new Subject<{type: string, data: any}>();
    
    // Different components listening to different events
    const userEventSub = eventBus.subscribe(event => {
      if (event.type === 'USER_ACTION') {
        this.utility.print(`🔧 Settings Component: User ${event.data}`, 'eventBusContainer');
      }
    });

    const dataEventSub = eventBus.subscribe(event => {
      if (event.type === 'DATA_UPDATE') {
        this.utility.print(`📊 Dashboard Component: Data ${event.data}`, 'eventBusContainer');
      }
    });

    // Simulate events
    setTimeout(() => eventBus.next({type: 'USER_ACTION', data: 'logged in'}), 1000);
    setTimeout(() => eventBus.next({type: 'DATA_UPDATE', data: 'refreshed'}), 2000);
    setTimeout(() => eventBus.next({type: 'USER_ACTION', data: 'updated profile'}), 3000);

    this.subscriptions.push(userEventSub, dataEventSub);
  }

  setupChatDemo() {
    this.utility.print('=== Real-Life Example 3: Chat System ===', 'chatContainer');
    
    const chatSubject = new Subject<{user: string, message: string, timestamp: Date}>();
    
    // Different chat windows listening
    const chatWindow1 = chatSubject.subscribe(msg => {
      this.utility.print(`💬 Chat Window 1: ${msg.user}: ${msg.message}`, 'chatContainer');
    });

    const chatWindow2 = chatSubject.subscribe(msg => {
      this.utility.print(`💬 Chat Window 2: ${msg.user}: ${msg.message}`, 'chatContainer');
    });

    const notificationService = chatSubject.subscribe(msg => {
      this.utility.print(`🔔 Notification: New message from ${msg.user}`, 'chatContainer');
    });

    // Simulate incoming messages
    setTimeout(() => {
      chatSubject.next({user: 'Alice', message: 'Hello everyone!', timestamp: new Date()});
    }, 1000);

    setTimeout(() => {
      chatSubject.next({user: 'Bob', message: 'How is everyone doing?', timestamp: new Date()});
    }, 2500);

    setTimeout(() => {
      chatSubject.next({user: 'Charlie', message: 'Great to see you all!', timestamp: new Date()});
    }, 4000);

    this.subscriptions.push(chatWindow1, chatWindow2, notificationService);
  }

  // Interactive demo methods
  sendNotification() {
    const messages = [
      'New order received!',
      'System update completed',
      'User profile updated',
      'Payment processed successfully',
      'New comment on your post'
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    this.notificationSubject.next(randomMessage);
  }

  sendCustomNotification(message: string) {
    if (message.trim()) {
      this.notificationSubject.next(message);
    }
  }

  demonstrateMulticasting() {
    this.utility.print('=== Multicasting Demonstration ===', 'multicastContainer');
    
    const source = interval(1000).pipe(takeUntil(this.destroy$));
    const subject = new Subject<number>();
    
    // Connect source to subject
    const sourceSubscription = source.subscribe(subject);
    
    // Multiple subscribers
    const sub1 = subject.subscribe(value => {
      this.utility.print(`🔴 Observer 1: ${value}`, 'multicastContainer');
    });

    const sub2 = subject.subscribe(value => {
      this.utility.print(`🔵 Observer 2: ${value}`, 'multicastContainer');
    });

    // Add third subscriber after delay
    setTimeout(() => {
      const sub3 = subject.subscribe(value => {
        this.utility.print(`🟢 Observer 3 (late): ${value}`, 'multicastContainer');
      });
      this.subscriptions.push(sub3);
    }, 3000);

    // Stop after 8 seconds
    setTimeout(() => {
      sourceSubscription.unsubscribe();
      subject.complete();
    }, 8000);

    this.subscriptions.push(sourceSubscription, sub1, sub2);
  }

  goBackToDashboard(): void {
    this.router.navigate(['/observable']);
  }
}
