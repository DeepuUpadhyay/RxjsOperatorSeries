import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterOperatorComponent } from './filter-operator.component';

describe('FilterOperatorComponent', () => {
  let component: FilterOperatorComponent;
  let fixture: ComponentFixture<FilterOperatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterOperatorComponent]
    });
    fixture = TestBed.createComponent(FilterOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
