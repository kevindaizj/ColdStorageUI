import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { WalletInfo, WalletOperInfo } from 'app/models/wallets/wallet';

@Component({
    selector: 'app-wallet-card',
    templateUrl: './wallet-card.component.html',
    styleUrls: ['./wallet-card.component.less']
})
export class WalletCardComponent implements OnInit {

    @Input()
    walletInfo: WalletInfo;

    @Output()
    showDetail = new EventEmitter<any>();

    @Output()
    edit = new EventEmitter<any>();

    @Output()
    unlock = new EventEmitter<WalletOperInfo>();

    @Output()
    lock = new EventEmitter<string>();

    @Output()
    recover = new EventEmitter<WalletOperInfo>();

    constructor() {

    }

    ngOnInit(): void {
    }


    detail() {
        this.showDetail.emit(this.walletInfo);
    }

    editWallet() {
        this.edit.emit(this.walletInfo);
    }

    lockWallet() {
        if (this.walletInfo.IsLogin) {
            this.lock.emit(this.walletInfo.WalletId);
        } else {
            this.unlock.emit({
                WalletId: this.walletInfo.WalletId,
                PWDHint: this.walletInfo.PWDHint
            });
        }
    }

    recoverWallet() {
        this.recover.emit({
            WalletId: this.walletInfo.WalletId,
            PWDHint: this.walletInfo.PWDHint
        });
    }

}
