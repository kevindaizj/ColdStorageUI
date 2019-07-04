import { Directive, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DCCustomValidators, DCVCompareWithOperator } from '../custom-validators';
import { Subject } from 'rxjs';


@Directive({
// tslint:disable-next-line: directive-selector
    selector: '[nxCompareWith]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: CompareWithValidator, multi: true }
    ]
})
export class CompareWithValidator implements Validator, OnChanges, OnDestroy {

    @Input('nxCompareWith')
    compareControlName: string;
// tslint:disable-next-line: no-input-rename
    @Input('comparedValue')
    comparedValue: any;
// tslint:disable-next-line: no-input-rename
    @Input('compareOperator')
    operator: string;

    private validator: ValidatorFn;
    private onChange: () => void;

    private clearSignal = new Subject<boolean>();

    validate(control: AbstractControl): ValidationErrors | null {
        return this.validator(control);
    }

    private createValidator(): void {
        this.validator = DCCustomValidators.compareWith(this.compareControlName,
                                                        this.clearSignal.asObservable(),
                                                        this.comparedValue,
                                                        DCVCompareWithOperator[this.operator]);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('compareControlName' in changes || 'comparedValue' in changes || 'operator' in changes) {
            this.createValidator();
            if (this.onChange) this.onChange();
        }
    }

    registerOnValidatorChange(fn: () => void): void {
        this.onChange = fn;
    }

    ngOnDestroy(): void {
        this.clearSignal.next(true);
        this.clearSignal.unsubscribe();
    }

}
