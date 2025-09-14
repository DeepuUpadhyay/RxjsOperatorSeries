import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsynchComponent } from './asynch.component';

describe('AsynchComponent', () => {
  let component: AsynchComponent;
  let fixture: ComponentFixture<AsynchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsynchComponent]
    });
    fixture = TestBed.createComponent(AsynchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
