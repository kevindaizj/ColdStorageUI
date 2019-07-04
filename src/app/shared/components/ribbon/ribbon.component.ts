import { Component, OnInit, Input } from '@angular/core';


@Component({
// tslint:disable-next-line: component-selector
    selector: 'dc-ribbon',
    styleUrls: ['./ribbon.component.less'],
    template: `
    <div class="ribbon {{'ribbon-' + orientation}}" [ngClass]="{'disabled': disabled}">
        <span *ngIf="!disabled">{{text}}</span>
        <span *ngIf="disabled">{{disabledText}}</span>
    </div>
    `
})
export class DCRibbonComponent {

    @Input()
    text: string;

    @Input()
    disabledText: string;

    @Input()
    orientation: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'top-right';

    @Input()
    disabled = false;
}
