import { Component, OnInit, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SimpleDictService } from 'app/services/dict/simple-dict.service';
 
@Component({
    selector: 'app-dict-selection',
    template: `
	<nz-select [(ngModel)]="selectValue" [ngStyle]="innerStyle" [disabled]="disabled" [nzPlaceHolder]="emptyTitle" [nzAllowClear]="allowClear">
        <nz-option [nzValue]="item.key" [nzLabel]="item.val" *ngFor="let item of options"></nz-option>
    </nz-select>
	`,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DictSelectionComponent),
        multi: true
    }]
})

export class DictSelectionComponent implements OnInit, ControlValueAccessor {

    @Input() dictType: string;
    @Input() emptyTitle: string;
    @Input() allowClear = true;
    @Input() innerStyle = {};
    @Input() disabled = false;

    @Output()
    change = new EventEmitter();

    options = [];

    innerValue: any;
    get selectValue() {
        return this.innerValue;
    }
    set selectValue(newValue) {
        if (this.innerValue != newValue) {
            this.propagateChange(newValue);
            const selectedItems = this.options.filter(o => o.key === newValue);
            if(selectedItems && selectedItems.length)
                this.change.emit(selectedItems[0]);
            else
                this.change.emit(null);

            this.innerValue = newValue;
        }
    }

    constructor(private dictService: SimpleDictService) { }

    ngOnInit() {
        this.dictService.getAllVals(this.dictType)
            .subscribe(data => {
                this.options = data || [];
            });
    }


    writeValue(value: any) {
        this.innerValue = value;
    }

    propagateChange = (_: any) => { };

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any) { }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

}
