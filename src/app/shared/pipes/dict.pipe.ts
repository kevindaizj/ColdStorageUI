import { Pipe, PipeTransform } from '@angular/core';
import { SimpleDictService } from 'app/services/dict/simple-dict.service';

@Pipe({
    name: 'nxDict',
    pure: false
})
export class DictPipe implements PipeTransform {
    private value: string;
    private fetchedInput: any = null;

    constructor(private dictService: SimpleDictService) {

    }

    transform(input: string, type: string, defaultValue: any) {
        if ((input == null || typeof (input) === 'undefined')) {
            this.fetchedInput = null;
            return '';
        }

        if (this.fetchedInput == input) {
            return this.value;
        }

        this.fetchedInput = input;
        this.dictService.getPromiseVal(type, input)
            .subscribe(data => {
                if (data) {
                    this.value = data;
                } else {
                    if (defaultValue)
                        this.value = defaultValue;
                }
            }, err => {
                if (defaultValue)
                    this.value = defaultValue;
            });

        return this.value;
    }
}