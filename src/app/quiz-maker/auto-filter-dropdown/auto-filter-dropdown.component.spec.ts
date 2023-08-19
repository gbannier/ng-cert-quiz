import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoFilterDropdownComponent } from './auto-filter-dropdown.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('AutoFilterDropdownComponent', () => {
  let component: AutoFilterDropdownComponent;
  let fixture: ComponentFixture<AutoFilterDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoFilterDropdownComponent],
      schemas:[NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AutoFilterDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
