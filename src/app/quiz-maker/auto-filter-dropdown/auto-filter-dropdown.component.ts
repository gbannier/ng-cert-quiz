import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
export interface DropdownOption {
  value: string | number;
  label: string;
}
@Component({
  selector: 'app-auto-filter-dropdown',
  templateUrl: './auto-filter-dropdown.component.html',
  styleUrls: ['./auto-filter-dropdown.component.css']
})
export class AutoFilterDropdownComponent implements OnInit{
  @Input() options: DropdownOption[] = [];
  @Input() labelModifierFn: ((label: string)=>string) | undefined = undefined;
  @Input() placeholder: string = 'Select Item...';
  @Output() selectionChange = new EventEmitter<DropdownOption>();
  filterText = '';
  filteredOptions: DropdownOption[] = [];
  isDropdownOpen = false;
  ngOnInit() {
    if (this.options.length > 0 && this.labelModifierFn) {
      this.modifyLabel();
    }
    this.filteredOptions = [...this.options];

  }

  private modifyLabel() {
    this.options = this.options.map(option =>
        ({
          label: this.labelModifierFn!(option.label),
          value: option.value
        })
    );
  }
  onInputFocus() {
    this.isDropdownOpen = true;
  }

  onInputBlur() {
    this.isDropdownOpen = false;
  }
  onFilterChange() {
    if (this.options.length > 0 && this.labelModifierFn) {
      this.modifyLabel();
    }
    this.filteredOptions = [...this.options];
    if(this.filterText.length>1){
      this.filteredOptions = this.options.filter(option =>
          option.label.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }

  }

  onSelectChange(option: DropdownOption) {
    console.log(option, 'onSelectChange')
    this.filterText = option.label;
    this.selectionChange.emit(option);
    this.isDropdownOpen = false;
  }
}




