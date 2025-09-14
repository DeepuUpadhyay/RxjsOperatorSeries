import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromiseComponent } from './promise/promise.component';
import { AllComponent } from './observable/all/all.component';
import { OfFromComponent } from './observable/of-from/of-from.component';
import { PluckComponent } from './observable/pluck/pluck.component';
import { FilterOperatorComponent } from './observable/filter-operator/filter-operator.component';
import { TabComponent } from './tab/tab.component';
import { TakeComponent } from './observable/take/take.component';
import { RetryComponent } from './observable/retry/retry.component';

import { DebounceComponent } from './observable/debounce/debounce.component';
import { SubjectComponent } from './observable/subject/subject.component';
import { ReplaySubjectComponent } from './observable/replay-subject/replay-subject.component';
import { AsynchComponent } from './observable/asynch/asynch.component';
import { MergeComponent } from './observable/merge/merge.component';
import { ConcatComponent } from './observable/concat/concat.component';
import { MergeMapComponent } from './observable/merge-map/merge-map.component';
import { ConcatmapComponent } from './observable/concatmap/concatmap.component';
import { SwitchMapComponent } from './observable/switch-map/switch-map.component';

const routes: Routes = [
  {
    path: 'promise',
    component: PromiseComponent,
  },
  {
    path: 'obserable',
    loadComponent: () => import('./observable/observable-dashboard/observable-dashboard.component').then(m => m.ObservableDashboardComponent),
    children: [
      {
        path: '',
        component: AllComponent,
      },
      {
        path: 'fromEvent',
        loadComponent: () => import('./observable/from-event/from-event.component').then(m => m.FromEventComponent),
      },
      {
        path: 'interval',
        loadComponent: () => import('./observable/interval-operator/interval-operator.component').then(m => m.IntervalOperatorComponent),
      },
      {
        path: 'ofFrom',
        component: OfFromComponent,
      },
      // {
      //   path: 'toArray',
      //   component: ToArrayComponent,
      // },
      // {
      //   path: 'custome',
      //   component: CustomObserableComponent,
      // },
      {
        path: 'map',
        loadComponent: () => import('./observable/map-component/map-component.component').then(m => m.MapComponentComponent),
      },
      {
        path: 'pluck',
        component: PluckComponent,
      },
      {
        path: 'tab',
        component: TabComponent,
      },
      {
        path: 'filter',
        component: FilterOperatorComponent,
      },
      {
        path: 'take',
        component: TakeComponent,
      },
      {
        path: 'retry',
        component: RetryComponent,
      },
      {
        path: 'debounce',
        component: DebounceComponent,
      },
      {
        path: 'merge',
        component: MergeComponent,
      },
      {
        path: 'subject',
        component: SubjectComponent,
      },
      {
        path: 'reply-subject',
        component: ReplaySubjectComponent,
      },
      {
        path: 'async-subject',
        component: AsynchComponent,
      },
      {
        path: 'concateMap',
        component: ConcatComponent,
      },
      {
        path: 'mergeMap',
        component: MergeMapComponent,
      },
      {
        path: 'concateMaps',
        component: ConcatmapComponent,
      },
      {
        path: 'switchMap',
        component: SwitchMapComponent,
      },
      {
        path:'forkJoin',
        loadComponent: () => import('./fork-join/fork-join.component').then(m => m.ForkJoinComponent)
      }
    ],
  },
  // Individual Operator Routes (separate pages)
  {
    path: 'observable-operators/list',
    loadComponent: () => import('./observable/all/all.component').then(m => m.AllComponent)
  },
  {
    path: 'observable-operators/asynch',
    loadComponent: () => import('./observable/asynch/asynch.component').then(m => m.AsynchComponent)
  },
  {
    path: 'observable-operators/custom',
    loadComponent: () => import('./observable/custom-obserable/custom-obserable.component').then(m => m.CustomObserableComponent)
  },
  {
    path: 'observable-operators/from-event',
    loadComponent: () => import('./observable/from-event/from-event.component').then(m => m.FromEventComponent)
  },
  {
    path: 'observable-operators/interval',
    loadComponent: () => import('./observable/interval-operator/interval-operator.component').then(m => m.IntervalOperatorComponent)
  },
  {
    path: 'observable-operators/of-from',
    loadComponent: () => import('./observable/of-from/of-from.component').then(m => m.OfFromComponent)
  },
  {
    path: 'observable-operators/map',
    loadComponent: () => import('./observable/map-component/map-component.component').then(m => m.MapComponentComponent)
  },
  {
    path: 'observable-operators/pluck',
    loadComponent: () => import('./observable/pluck/pluck.component').then(m => m.PluckComponent)
  },
  {
    path: 'observable-operators/filter',
    loadComponent: () => import('./observable/filter-operator/filter-operator.component').then(m => m.FilterOperatorComponent)
  },

  {
    path: 'observable-operators/take',
    loadComponent: () => import('./observable/take/take.component').then(m => m.TakeComponent)
  },
  {
    path: 'observable-operators/retry',
    loadComponent: () => import('./observable/retry/retry.component').then(m => m.RetryComponent)
  },
  {
    path: 'observable-operators/debounce-time',
    loadComponent: () => import('./observable/debounce/debounce.component').then(m => m.DebounceComponent)
  },
  {
    path: 'observable-operators/subject',
    loadComponent: () => import('./observable/subject/subject.component').then(m => m.SubjectComponent)
  },
  {
    path: 'observable-operators/replay-subject',
    loadComponent: () => import('./observable/replay-subject/replay-subject.component').then(m => m.ReplaySubjectComponent)
  },
  {
    path: 'observable-operators/concat',
    loadComponent: () => import('./observable/concat/concat.component').then(m => m.ConcatComponent)
  },
  {
    path: 'observable-operators/merge',
    loadComponent: () => import('./observable/merge/merge.component').then(m => m.MergeComponent)
  },
  {
    path: 'observable-operators/merge-map',
    loadComponent: () => import('./observable/merge-map/merge-map.component').then(m => m.MergeMapComponent)
  },
  {
    path: 'observable-operators/concat-map',
    loadComponent: () => import('./observable/concatmap/concatmap.component').then(m => m.ConcatmapComponent)
  },
  {
    path: 'observable-operators/switch-map',
    loadComponent: () => import('./observable/switch-map/switch-map.component').then(m => m.SwitchMapComponent)
  },
  {
    path: 'observable-operators/to-array',
    loadComponent: () => import('./observable/to-array/to-array.component').then(m => m.ToArrayComponent)
  },
  {
    path: 'observable-operators/forkJoin',
    loadComponent: () => import('./fork-join/fork-join.component').then(m => m.ForkJoinComponent)
  },
  {
    path: '**',
    redirectTo: '/obserable',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
