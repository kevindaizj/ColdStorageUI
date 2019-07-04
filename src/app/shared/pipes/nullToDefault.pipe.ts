import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nullToDefault'
})
export class NullToDefaultPipe implements PipeTransform {

    constructor() {

    }

    transform(input: any, defaultValue: any) {
        defaultValue = defaultValue || '--';
        if (input === null || input === undefined)
            return defaultValue;
        if (typeof input === 'string' && input == '')
            return defaultValue;
        return input;
    }
}