import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForkJoinComponent } from './fork-join.component';

describe('ForkJoinComponent', () => {
  let component: ForkJoinComponent;
  let fixture: ComponentFixture<ForkJoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForkJoinComponent]
    });
    fixture = TestBed.createComponent(ForkJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
