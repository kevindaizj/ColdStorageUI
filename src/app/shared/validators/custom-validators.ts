import { takeUntil } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

export enum DCVCompareWithOperator {
    Equal = '==',
    NotEqual = '!=',
    GreaterThan = '>',
    GreaterThanOrEqual = '>=',
    LessThan = '<',
    LessThanOrEqual = '<='
}

export class DCCustomValidators {

    private static dynamicEval(operatorStr, value, comparedVal): boolean {
        let result = false;
        if (comparedVal && {}.toString.call(comparedVal) === '[object Function]')
            comparedVal = comparedVal();
// tslint:disable-next-line: no-eval
        eval('result = value' + operatorStr + 'comparedVal');
        return result;
    }

    static compareWith(compareControlName: string,
                       clearSignal$: Observable<any> = null,
                       specifiedValue: () => any | any = null,
                       operator: DCVCompareWithOperator = DCVCompareWithOperator.Equal): ValidatorFn {
        let first = true;
        return (control: AbstractControl): ValidationErrors | null  => {

            let compareValue = specifiedValue;
            if (compareControlName) {
                const compare = control.root.get(compareControlName);
                if (!compare)
                    return null;
                compareValue = compare.value;

                if (first) {
                    first = false;
                    if (!clearSignal$)
                        throw new Error('clearSignal$ must be provided while using cross-field validation');

                    compare.valueChanges
                           .pipe( takeUntil(clearSignal$) )
                           .subscribe(() => {
                               control.updateValueAndValidity();
                               control.markAsDirty();
                           });
                }
            }

            const isValid = DCCustomValidators.dynamicEval(operator, control.value, compareValue);
            return !isValid
                   ? { compareWith: { compareWith: true, value: control.value, operator, compareValue } }
                   : null;
        };
    }

    private static removeError(control: AbstractControl, errCode: string) {
        if (control.hasError(errCode)) {
            const errors = { ...control.errors };
            delete errors[errCode];
            if (Object.keys(errors).length === 0)
                control.setErrors(null);
            else
                control.setErrors(errors);
        }
    }

    static crossRequiredIf(controlName: string,
                           comparedControlName: string,
                           predicate: (control: AbstractControl, comparedControl: AbstractControl) => boolean)
    : ValidatorFn {
        return (form: AbstractControl): ValidationErrors | null  => {
            const control = form.get(controlName);
            const comparedControl = form.get(comparedControlName);
            if (predicate(control, comparedControl)) {
                const requiredErr = Validators.required(control);
                if (requiredErr) {
                    const error = {
                        crossRequiredIf: {
                            crossRequiredIf: true,
                            control: controlName,
                            crossControl: comparedControlName
                        }
                    };
                    control.setErrors(error);
                    return error;
                } else {
                    DCCustomValidators.removeError(control, 'crossRequiredIf');
                    return null;
                }
            } else {
                DCCustomValidators.removeError(control, 'crossRequiredIf');
                return null;
            }
        }
    }
}
