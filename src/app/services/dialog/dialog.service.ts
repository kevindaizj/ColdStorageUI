import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class DCDialogService {

    constructor(
        private modalService: NzModalService,
        private translate: TranslateService
    ) { }

    fatalConfirm(msgI18n: string, okCallback: () => void) {
        this.translate.get(msgI18n).subscribe(msg => {
            this.modalService.confirm({
                nzTitle: msg,
                nzOkType: 'danger',
                nzOnOk: okCallback
            });
        });
    }

    confirm(msgI18n: string, okCallback: () => void) {
        this.translate.get(msgI18n).subscribe(msg => {
            this.modalService.confirm({
                nzTitle: msg,
                nzOnOk: okCallback
            });
        });
    }
}