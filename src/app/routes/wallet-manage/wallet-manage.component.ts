import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { WalletInfo, WalletOperInfo } from 'app/models/wallets/wallet';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd';
import { WalletManageWalletDetailComponent } from './detail/detail.component';
import { WalletManageWalletUnlockComponent } from './unlock/unlock.component';
import { WalletManageWalletRecoverComponent } from './recover/recover.component';
import { DCDialogService } from 'app/services/dialog/dialog.service';
import { WalletManageWalletEditComponent } from './edit/edit.component';

@Component({
    selector: 'app-routes-wallet-manage',
    templateUrl: './wallet-manage.component.html',
    styleUrls: ['./wallet-manage.component.less'],
})
export class WalletManageComponent implements OnInit {

    wallets: WalletInfo[];
    loading = false;

    constructor(public http: _HttpClient,
                private modalService: NzModalService,
                private dialog: DCDialogService,
                private router: Router) { }

    ngOnInit(): void {
       this.getWallets();
    }

    private getWallets() {
        this.loading = true;
        this.wallets = [];
        this.http.post('/api/common/wallet/dropdownlist', {
            data: {}
        })
        .pipe(finalize(() => this.loading = false))
        .subscribe(res => {
            this.wallets = res.data;
        });
    }

    private refreshWallet(walletId: string) {
        this.loading = true;
        this.http.get(`/api/wallet/detail/${walletId}`, {})
        .pipe(finalize(() => this.loading = false))
        .subscribe(res => {
            const wallet = res.data;
            if (!wallet) return;

            const newWallets = [];
            for (const w of this.wallets) {
                if (w.WalletId === wallet.WalletId) {
                    const newWallet = { ...w, ...wallet };
                    newWallets.push(newWallet);
                } else {
                    newWallets.push(w);
                }
            }
            this.wallets = newWallets;
        });
    }

    addWallet() {
        this.router.navigate([`/wallet-manage/add`]);
    }

    showWalletDetail(wallet: any) {
        this.modalService.create({
            nzTitle: '錢包詳細',
            nzStyle: { top: '50px' },
            nzContent: WalletManageWalletDetailComponent,
            nzComponentParams: {
                wallet
            },
            nzMaskClosable: true,
            nzFooter: null,
            nzClosable: true
        });
    }

    editWallet(walletInfo: any) {
        const modal = this.modalService.create({
            nzTitle: '編輯錢包',
            nzStyle: { top: '50px' },
            nzContent: WalletManageWalletEditComponent,
            nzComponentParams: {
                walletInfo
            },
            nzMaskClosable: false,
            nzFooter: null,
            nzClosable: false
        });

        modal.afterClose.subscribe((refresh: boolean) => {
            if (refresh) {
                this.refreshWallet(walletInfo.WalletId);
            }
        });
    }

    unlockWallet(walletInfo: WalletOperInfo) {
        const modal = this.modalService.create({
            nzTitle: '解鎖錢包',
            nzStyle: { top: '50px' },
            nzContent: WalletManageWalletUnlockComponent,
            nzComponentParams: {
                walletInfo
            },
            nzMaskClosable: false,
            nzFooter: null,
            nzClosable: false
        });

        modal.afterClose.subscribe((refresh: boolean) => {
            if (refresh) {
                this.refreshWallet(walletInfo.WalletId);
            }
        });
    }

    lockWallet(walletId: string) {
        this.dialog.confirm('確定要鎖定此錢包？', () => {
            this.loading = true;
            this.http.post('/api/common/wallet/logout', {
                data: {
                    WalletId: walletId
                }
            })
            .pipe(finalize(() => this.loading = false))
            .subscribe(() => {
                this.refreshWallet(walletId);
            });
        });
    }

    recoverWallet(walletInfo: WalletOperInfo) {
        const modal = this.modalService.create({
            nzTitle: '恢復錢包',
            nzStyle: { top: '50px' },
            nzContent: WalletManageWalletRecoverComponent,
            nzComponentParams: {
                walletInfo
            },
            nzMaskClosable: false,
            nzFooter: null,
            nzClosable: false
        });

        modal.afterClose.subscribe((refresh: boolean) => {
            if (refresh) {
                this.refreshWallet(walletInfo.WalletId);
            }
        });
    }
}
