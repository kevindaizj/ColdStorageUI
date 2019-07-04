import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MessagePlusService } from 'app/services/messages/message-plus.service';
import { FormHelper } from '@shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-routes-wallet-manage-edit-wallet',
    templateUrl: './edit.component.html'
})
export class WalletManageWalletEditComponent implements OnInit {

    @Input() walletInfo: any;

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private modal: NzModalRef,
        private modalService: NzModalService,
        private msg: MessagePlusService,
        public http: _HttpClient,
        private translate: TranslateService
    ) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            Name: [ this.walletInfo.Name, [Validators.required]],
            PWDHint: [this.walletInfo.PWDHint],
            Remark: [this.walletInfo.Remark]
        });
    }

    submit() {
        this.form.updateValueAndValidity();
        if (this.form.invalid) {
            FormHelper.validateWholeForm(this.form);
            return;
        }

        const postUrl = '/api/wallet/update';
        const postData = {
            ...this.form.value,
            WalletId: this.walletInfo.WalletId
        };

        this.http.post(postUrl, {
            data: postData
        }).subscribe(data => {
            this.msg.success('saveSuccess');
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
