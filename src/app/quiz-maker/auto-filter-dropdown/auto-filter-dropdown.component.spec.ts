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

  it('should prepare filtered options on initialization', () => {
    component.options = [{ label: 'Science', value: 1 }];
    component.ngOnInit()
    expect(component.filteredOptions).toEqual(component.options);
    expect(component.labelModifierFn).toBeUndefined();

  });

  it('should modify labels if labelModifierFn is provided', () => {
    component.options = [{ label: 'Science', value: 1 }];
    component.labelModifierFn = label => label + ' modified';
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.filteredOptions[0].label).toEqual('Science modified');
  });

  it('should emit selectionChange event on option selection', () => {
    component.options = [{ label: 'Science', value: 1 }, { label: 'Entertainment', value: 2 }];
    fixture.detectChanges();
    spyOn(component.selectionChange, 'emit');

    component.onSelectChange(component.options[0]);

    expect(component.selectionChange.emit).toHaveBeenCalledWith(component.options[0]);
  });

  it('should filter options based on filter text', () => {
    component.options = [
      { label: 'Science', value: 1 },
      { label: 'Entertainment', value: 2 },
      { label: 'Art', value: 3 }
    ];
    component.filterText = 'Sci';
    fixture.detectChanges();

    component.onFilterChange();

    expect(component.filteredOptions).toEqual([{ label: 'Science', value: 1 }]);
  });
});
