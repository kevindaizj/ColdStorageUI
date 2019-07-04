import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MessagePlusService } from 'app/services/messages/message-plus.service';
import { FormHelper } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from 'app/services/electron/electron.service';
import { CryptoService } from 'app/services/crypto/crypto.service';
import { WalletOperInfo } from 'app/models/wallets/wallet';

@Component({
    selector: 'app-routes-wallet-manage-unlock-wallet',
    templateUrl: './unlock.component.html'
})
export class WalletManageWalletUnlockComponent implements OnInit {

    @Input() walletInfo: WalletOperInfo;

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private modal: NzModalRef,
        private modalService: NzModalService,
        private msg: MessagePlusService,
        public http: _HttpClient,
        private translate: TranslateService,
        private electron: ElectronService,
        private crypto: CryptoService
    ) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            WalletJsonPath: [null, [Validators.required]],
            OriginalPwd: [null, [Validators.required]]
        });
    }

    selectWalletPath() {
        const results = this.electron.remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (results && results.length) {
            this.form.patchValue({
                WalletJsonPath: results[0]
            });
        }
    }

    submit() {
        this.form.updateValueAndValidity();
        if (this.form.invalid) {
            FormHelper.validateWholeForm(this.form);
            return;
        }

        const postUrl = '/api/wallet/logon';
        const postData = {
            ...this.form.value,
            WalletId: this.walletInfo.WalletId,
            OriginalPwd: this.crypto.AESEncrypt(this.form.get('OriginalPwd').value, null)
        };

        this.http.post(postUrl, {
            data: postData
        }).subscribe(data => {
            this.msg.success('unlockSuccess');
            this.back(true);
        });
    }

    close() {
        if (!this.form.pristine) {
            this.modalService.confirm({
                nzTitle: this.translate.instant('exitWithoutSaving'),
                nzOnOk: () => this.back()
            });
        } else {
            this.back();
        }
    }

    back(refresh: boolean = false) {
        this.modal.destroy(refresh);
    }

}
