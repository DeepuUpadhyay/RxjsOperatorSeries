import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReplaySubject, Subscription, interval, takeUntil, Subject } from 'rxjs';
import { UtilitesService } from 'src/app/services/utilites.service';

@Component({
  selector: 'app-replay-subject',
  templateUrl: './replay-subject.component.html',
  styleUrls: ['./replay-subject.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ReplaySubjectComponent implements OnInit, OnDestroy {
  userList1 = ['Angular 1', 'Angular 2'];
  userList2: any = [];
  userList3: string[] = [];
  private destroy$ = new Subject<void>();

  // Operator Definition
  operatorDefinition = `
    ReplaySubject: A special type of Subject that replays the last n values (or all values) 
    to new subscribers. Unlike regular Subject, it stores values and emits them to late subscribers.
    Perfect for caching and state management scenarios.
  `;

  // Real-life Examples
  realLifeExamples = [
    {
      title: "1. User Session Cache",
      description: "Cache user session data and replay it to components that load later.",
      code: `
        sessionCache = new ReplaySubject<User>(1);
        
        // Cache user data
        this.sessionCache.next(currentUser);
        
        // Late-loading component gets cached data
        this.sessionCache.subscribe(user => 
          this.updateProfile(user));
      `
    },
    {
      title: "2. Configuration Settings",
      description: "Store app configuration and provide it to any component that needs it.",
      code: `
        configSubject = new ReplaySubject<Config>(1);
        
        // Load and cache config
        this.loadConfig().then(config => 
          this.configSubject.next(config));
        
        // Components get config whenever they subscribe
        this.configSubject.subscribe(config => 
          this.applySettings(config));
      `
    },
    {
      title: "3. Recent Activity Log",
      description: "Keep track of recent user activities and show them to new dashboard views.",
      code: `
        activityLog = new ReplaySubject<Activity>(5);
        
        // Log activities
        this.activityLog.next(newActivity);
        
        // Dashboard shows last 5 activities
        this.activityLog.subscribe(activities => 
          this.displayActivities(activities));
      `
    }
  ];

  // Demo variables
  subscribeMod2: boolean = false;
  subscribeMod3: boolean = false;
  subscription2!: Subscription;
  subscription3!: Subscription;
  private subscriptions: Subscription[] = [];

  // ReplaySubject demonstrations
  configReplaySubject = new ReplaySubject<string>(3); // Buffer size 3
  userActivitySubject = new ReplaySubject<{action: string, timestamp: Date}>(5);
  sessionDataSubject = new ReplaySubject<{userId: string, sessionId: string}>(1);

  constructor(private utility: UtilitesService, private router: Router) {}

  ngOnInit() {
    this.utility.videoEmit.subscribe((res) => {
      this.userList1.push(res);
    });

    this.setupReplaySubjectExamples();
    this.demonstrateBufferSize();
    this.demonstrateSessionCache();
    this.demonstrateActivityLog();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
  }

  setupReplaySubjectExamples() {
    this.utility.print('=== ReplaySubject Basic Example ===', 'replayContainer');
    
    const replaySubject = new ReplaySubject<number>(2); // Buffer last 2 values
    
    // Emit some values before any subscription
    replaySubject.next(1);
    replaySubject.next(2);
    replaySubject.next(3);
    
    this.utility.print('Values emitted: 1, 2, 3', 'replayContainer');
    
    // First subscriber (will get last 2 values: 2, 3)
    setTimeout(() => {
      const sub1 = replaySubject.subscribe(value => {
        this.utility.print(`Early Subscriber received: ${value}`, 'replayContainer');
      });
      this.subscriptions.push(sub1);
    }, 1000);
    
    // Emit more values
    setTimeout(() => {
      replaySubject.next(4);
      this.utility.print('New value emitted: 4', 'replayContainer');
    }, 2000);
    
    // Late subscriber (will get last 2 values: 3, 4)
    setTimeout(() => {
      const sub2 = replaySubject.subscribe(value => {
        this.utility.print(`Late Subscriber received: ${value}`, 'replayContainer');
      });
      this.subscriptions.push(sub2);
    }, 3000);
  }

  demonstrateBufferSize() {
    this.utility.print('=== Buffer Size Demonstration ===', 'bufferContainer');
    
    // Emit configuration values
    this.configReplaySubject.next('theme: dark');
    this.configReplaySubject.next('language: en');
    this.configReplaySubject.next('timezone: UTC');
    this.configReplaySubject.next('notifications: on');
    
    this.utility.print('Config values emitted: theme, language, timezone, notifications', 'bufferContainer');
    
    // Late subscriber will only get last 3 values
    setTimeout(() => {
      const configSub = this.configReplaySubject.subscribe(config => {
        this.utility.print(`Config Service received: ${config}`, 'bufferContainer');
      });
      this.subscriptions.push(configSub);
    }, 1000);
  }

  demonstrateSessionCache() {
    this.utility.print('=== Session Cache Example ===', 'sessionContainer');
    
    // Simulate user login
    this.sessionDataSubject.next({
      userId: 'user123',
      sessionId: 'sess_' + Math.random().toString(36).substr(2, 9)
    });
    
    this.utility.print('User session cached', 'sessionContainer');
    
    // Components subscribing later will get cached session
    setTimeout(() => {
      const profileSub = this.sessionDataSubject.subscribe(session => {
        this.utility.print(`Profile Component got session: ${session.userId}`, 'sessionContainer');
      });
      this.subscriptions.push(profileSub);
    }, 1500);
    
    setTimeout(() => {
      const dashboardSub = this.sessionDataSubject.subscribe(session => {
        this.utility.print(`Dashboard Component got session: ${session.sessionId}`, 'sessionContainer');
      });
      this.subscriptions.push(dashboardSub);
    }, 2500);
  }

  demonstrateActivityLog() {
    this.utility.print('=== Activity Log Example ===', 'activityContainer');
    
    // Simulate user activities
    const activities = [
      'User logged in',
      'Profile updated',
      'Settings changed',
      'File uploaded',
      'Message sent'
    ];
    
    activities.forEach((activity, index) => {
      setTimeout(() => {
        this.userActivitySubject.next({
          action: activity,
          timestamp: new Date()
        });
        this.utility.print(`Activity logged: ${activity}`, 'activityContainer');
      }, index * 500);
    });
    
    // Late subscriber will get last 5 activities
    setTimeout(() => {
      const activitySub = this.userActivitySubject.subscribe(activity => {
        this.utility.print(`Activity Monitor: ${activity.action} at ${activity.timestamp.toLocaleTimeString()}`, 'activityContainer');
      });
      this.subscriptions.push(activitySub);
    }, 3000);
  }

  // Interactive demo methods
  addNewConfig() {
    const configs = [
      'theme: light',
      'language: es',
      'currency: EUR',
      'dateFormat: DD/MM/YYYY',
      'timeFormat: 24h'
    ];
    const randomConfig = configs[Math.floor(Math.random() * configs.length)];
    this.configReplaySubject.next(randomConfig);
    this.utility.print(`New config added: ${randomConfig}`, 'bufferContainer');
  }

  simulateNewSession() {
    const newSession = {
      userId: 'user' + Math.floor(Math.random() * 1000),
      sessionId: 'sess_' + Math.random().toString(36).substr(2, 9)
    };
    this.sessionDataSubject.next(newSession);
    this.utility.print(`New session created: ${newSession.userId}`, 'sessionContainer');
  }

  logNewActivity() {
    const activities = [
      'Document created',
      'Email sent',
      'Meeting scheduled',
      'Task completed',
      'Comment added',
      'File shared',
      'Status updated'
    ];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    this.userActivitySubject.next({
      action: randomActivity,
      timestamp: new Date()
    });
    this.utility.print(`New activity: ${randomActivity}`, 'activityContainer');
  }

  // Original methods for backward compatibility
  UserData(useValue: string) {
    this.utility.videoEmit.next(useValue);
  }

  replaySubject = 'Replay subject is used to store the previous values and it will emit the previous values to the new subscribers.';

  subscribe2() {
    if (this.subscribeMod2) {
      this.subscription2.unsubscribe();
    } else {
      this.subscription2 = this.utility.videoEmit.subscribe((res) => {
        this.userList2.push(res);
      });
    }
    this.subscribeMod2 = !this.subscribeMod2;
  }

  subscribe3() {
    if (this.subscribeMod3) {
      this.subscription3.unsubscribe();
    } else {
      this.subscription3 = this.utility.videoEmit.subscribe((res) => {
        this.userList3.push(res);
      });
    }
    this.subscribeMod3 = !this.subscribeMod3;
  }

  goBackToDashboard() {
    this.router.navigate(['/observable']);
  }
}
