import { TitleService, MenuService } from '@delon/theme';
import { Component, Input, OnInit } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'dc-breadcrumb',
    template: `
    <nz-breadcrumb>
        <nz-breadcrumb-item>
            <a [routerLink]="['/']">{{homePageTitle}}</a>
        </nz-breadcrumb-item>
        <nz-breadcrumb-item *ngFor="let history of histories">
            <ng-container *ngIf="!history.link">
                {{history.title}}
            </ng-container>
            <ng-container *ngIf="history.link">
                <a [routerLink]="history.link">{{history.title}}</a>
            </ng-container>
        </nz-breadcrumb-item>
    </nz-breadcrumb>
    `
})
export class DCBreadcrumbComponent implements OnInit {
    @Input()
    histories: DCBreadcrumbItem[];
    homePageTitle: string;

    constructor(private titleService: TitleService,
                private menuService: MenuService,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.translate.get('homePage').subscribe(t => this.homePageTitle = t);

        let i18nTitles = this.histories.map(o => o.i18nTitle).filter(o => o);
        if (!i18nTitles.length)
            i18nTitles = ['NoKey'];
        this.translate.get(i18nTitles).subscribe(translateTitles => {
            for (const h of this.histories) {
                if (h.hitMenu) {
                    this.menuService.openedByUrl(h.link, true);
                }
                h.title = h.i18nTitle ? translateTitles[h.i18nTitle] : h.title;
            }
            if (this.histories && this.histories.length) {
                this.titleService.setTitle(this.histories[this.histories.length - 1].title);
            }
        });
    }
}


export interface DCBreadcrumbItem {
    title: string;
    i18nTitle?: string;
    link?: string;
    hitMenu?: boolean;
}