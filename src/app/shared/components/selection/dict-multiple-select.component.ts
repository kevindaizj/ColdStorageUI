import { Component, OnInit, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { SimpleDictService } from 'app/services/dict/simple-dict.service';

@Component({
    selector: 'app-dict-multiple-selection',
    template: `
    <nz-select [(ngModel)]="selectedValues" [nzMaxTagCount]="maxTagCount"  [disabled]="disabled" nzMode="multiple"
        [nzPlaceHolder]="emptyTitle" [nzMaxTagPlaceholder]="tagPlaceHolder" >
      <nz-option *ngFor="let option of options" [nzLabel]="option.val" [nzValue]="option.key"></nz-option>
    </nz-select>
    <ng-template #tagPlaceHolder let-selectedList>
      and {{selectedList.length}} more selected
    </ng-template>
	`,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => DictMultipleSelectionComponent),
        multi: true
    }]
})

export class DictMultipleSelectionComponent implements OnInit, ControlValueAccessor {

    @Input() dictType: string;
    @Input() maxTagCount = 3;
    @Input() emptyTitle: string;
    @Input() allowClear = true;
    @Input() disabled = false;
    @Output()
    change = new EventEmitter();

    options = [];

    innerValues: any[] = [];
    get selectedValues() {
        return this.innerValues;
    }
    set selectedValues(newValues: any[]) {
        newValues = newValues ? newValues : [];
        const old = this.innerValues.map(o => o).sort().join(',');
        const neww = newValues.map(o => o).sort().join(',');
        if (old !== neww) {
            this.propagateChange(newValues);
            const selectedItems = this.options.filter(o => newValues.some(n => n === o));
            this.change.emit(selectedItems);
            this.innerValues = newValues;
        }
    }

    constructor(private dictService: SimpleDictService) { }

    ngOnInit() {
        this.dictService.getAllVals(this.dictType)
            .subscribe(data => {
                this.options = data || [];
            });
    }


    writeValue(values: any[]) {
        this.innerValues = values || [];
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
