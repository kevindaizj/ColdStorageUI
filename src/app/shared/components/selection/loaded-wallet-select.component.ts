import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
// tslint:disable-next-line: component-selector
    selector: 'loaded-wallet-select',
    template: `
    <nz-select [(ngModel)]="value" nzShowSearch="true" [disabled]="disabled" [nzPlaceHolder]="placeHolder" nzAllowClear>
        <nz-option [nzValue]="item.value" [nzLabel]="item.label" *ngFor="let item of wallets">
        </nz-option>
    </nz-select>
    `,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: LoadedWalletSelectComponent,
        multi: true
    }]
})
export class LoadedWalletSelectComponent implements OnInit, ControlValueAccessor {
    @Input()
    disabled: boolean;
    @Input()
    placeHolder: string;

    wallets: any[];


    innerValue: string | number;
    get value() {
        return this.innerValue;
    }
    set value(newValue: string | number) {
        if (this.innerValue !== newValue) {
            this.onChangeCallback(newValue);
            this.innerValue = newValue;
        }
    }

    private onChangeCallback = (_: any) => { };


    constructor(private http: _HttpClient) {

    }

    ngOnInit(): void {
        this.getWallets();
    }

    private getWallets(): any {
        this.wallets = [];
        this.http.post('/api/common/wallet/memory/dropdownlist', {})
        .subscribe((data: any) => {
            for (const item of data.data) {
                this.wallets.push({
                    value: item.WalletId,
                    label: item.WalletName
                });
            }
        })
    }

    writeValue(obj: any): void {
        this.innerValue = obj;
    }

    registerOnChange(fn: any): void {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void {

    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }


}