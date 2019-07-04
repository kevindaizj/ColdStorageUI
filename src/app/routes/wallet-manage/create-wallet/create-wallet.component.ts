import { Component, OnInit, OnDestroy } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { finalize } from 'rxjs/operators';
import { FormHelper, DCCustomValidators } from '@shared';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DCDialogService } from 'app/services/dialog/dialog.service';
import { MessagePlusService } from 'app/services/messages/message-plus.service';
import { Subject } from 'rxjs';
import { ElectronService } from 'app/services/electron/electron.service';
import { CryptoService } from 'app/services/crypto/crypto.service';

@Component({
    selector: 'app-routes-wallet-manage-create-wallet',
    templateUrl: './create-wallet.component.html',
    styleUrls: ['./create-wallet.component.less']
})
export class WalletManageCreateWalletComponent implements OnInit, OnDestroy {

    title = 'createNewWallet';
    histories: any;
    processing = false;
    created = false;

    form: FormGroup;

    passwordVisible = false;
    confirmPasswordVisible = false;

    private destroySignal = new Subject<boolean>();

    constructor(
        private fb: FormBuilder,
        public http: _HttpClient,
        private router: Router,
        private dialog: DCDialogService,
        private msg: MessagePlusService,
        private electron: ElectronService,
        private crypto: CryptoService) {
    }

    ngOnInit() {
        this.histories = [{
            link: '/wallet-manage',
            i18nTitle: 'Menu_WalletManagement',
            hitMenu: true
        }, {
            i18nTitle: this.title,
        }];

        this.form = this.fb.group({
            WalletJsonPath: [null, [Validators.required]],
            Name: [null, [Validators.required]],
            OriginalPwd: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})/)]],
            ConfirmPwd: [null, [Validators.required, DCCustomValidators.compareWith('OriginalPwd', this.destroySignal.asObservable())]],
            PWDHint: [null],
            Remark: [null]
        });
    }

    ngOnDestroy(): void {
        this.destroySignal.next(true);
        this.destroySignal.unsubscribe();
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

        const postUrl = '/api/wallet/create';
        const postData = {
            ...this.form.value,
            OriginalPwd: this.crypto.AESEncrypt(this.form.get('OriginalPwd').value, null),
            ConfirmPwd: null
        };
        this.processing = true;
        this.http.post(postUrl, {
            data: postData
        })
        .pipe(finalize(() => this.processing = false))
        .subscribe(data => {
            this.resetFromAfterCreating(data.data);
        });

    }

    private resetFromAfterCreating(cipherMnemonic: string) {
        this.created = true;
        const mnemonic = this.crypto.AESDecrypt(cipherMnemonic, null)
        this.form = this.fb.group({
            mnemonic: [{ value: mnemonic, disabled: true }]
        });
    }

    copy() {
        this.electron.remote.clipboard.writeText(this.form.get('mnemonic').value);
    }

    finish() {
        this.dialog.confirm('walletCreatedConfirmTip', () => this.back());
    }

    exit() {
        if (!this.form.pristine) {
            this.dialog.confirm('exitWithoutSaving', () => this.back());
        } else {
            this.back();
        }
    }

    private back() {
        this.router.navigate(['/wallet-manage']);
    }


}
