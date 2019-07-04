import { Component, Input } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
    selector: 'app-routes-wallet-manage-wallet-detail',
    templateUrl: './detail.component.html'
})
export class WalletManageWalletDetailComponent {

    @Input() wallet: any;

    constructor(private modal: NzModalRef) {
    }

    close() {
        this.modal.destroy();
    }

}
