import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DropdownOption} from "./dropdown-option.model";
@Component({
    selector: 'app-auto-filter-dropdown',
    templateUrl: './auto-filter-dropdown.component.html',
    styleUrls: ['./auto-filter-dropdown.component.css']
})
export class AutoFilterDropdownComponent implements OnInit {
    @Input() options: DropdownOption[] = [];
    @Input() labelModifierFn: ((label: string) => string) | undefined = undefined;
    @Input() placeholder: string = 'Select Item...';
    @Output() selectionChange = new EventEmitter<DropdownOption>();
    filterText = '';
    filteredOptions: DropdownOption[] = [];
    isDropdownOpen = false;

    ngOnInit() {
        this.prepareFilteredOptions();
    }

    onInputFocus() {
        this.isDropdownOpen = true;
    }

    onFilterChange() {
        this.prepareFilteredOptions();
        if (this.filterText.length > 1) {
            this.filteredOptions = this.options.filter(option =>
                option.label.toLowerCase().includes(this.filterText.toLowerCase())
            );
        }
    }

    onSelectChange(option: DropdownOption) {
        this.filterText = option.label;
        this.selectionChange.emit(option);
        this.isDropdownOpen = false;
    }

    private modifyLabel() {
        this.options = this.options.map(option =>
            ({
                label: this.labelModifierFn!(option.label),
                value: option.value
            })
        );
    }

    private prepareFilteredOptions() {
        if (this.options.length > 0 && this.labelModifierFn) {
            this.modifyLabel();
        }
        this.filteredOptions = [...this.options];
    }
}



