import { FormGroup, FormArray, FormControl } from '@angular/forms';

export class FormHelper {

    static validateWholeForm(form: FormGroup | FormArray) {
        Object.keys(form.controls).forEach(field => {
            const control = form.get(field);
            if (control instanceof FormControl) {
                control.markAsDirty();
                control.updateValueAndValidity();
            }
            if (control instanceof FormGroup || control instanceof FormArray)
                FormHelper.validateWholeForm(control);
        });
    }

    static isEmptyInputValue(value: any): boolean {
        // we don't check for string here so it also works with arrays
        return value == null || value.length === 0;
      }

}
