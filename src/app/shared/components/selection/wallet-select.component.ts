import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
// tslint:disable-next-line: component-selector
    selector: 'wallet-select',
    template: `
    <nz-select [(ngModel)]="value" nzShowSearch="true" [disabled]="disabled" [nzPlaceHolder]="placeHolder" nzAllowClear>
        <nz-option [nzValue]="item.value" [nzLabel]="item.label" nzCustomContent *ngFor="let item of wallets">
            <i *ngIf="item.isLogin" nz-icon type="check-circle" style="color: #87d068;"></i>
            <i *ngIf="!item.isLogin" nz-icon type="close-circle" style="color: #f50;"></i>
            &nbsp;{{item.label}}
        </nz-option>
    </nz-select>
    `,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: WalletSelectComponent,
        multi: true
    }]
})
export class WalletSelectComponent implements OnInit, ControlValueAccessor {
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
        this.http.post('/api/common/wallet/dropdownlist', {
            data: {
                Index: 1,
                PageSize: 1000000
            }
        })
        .subscribe((data: any) => {
            for (const item of data.data) {
                this.wallets.push({
                    value: item.WalletId,
                    label: item.Name,
                    isLogin: item.IsLogin
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