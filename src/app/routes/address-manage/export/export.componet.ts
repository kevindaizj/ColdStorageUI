import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { MessagePlusService } from 'app/services/messages/message-plus.service';
import { FormHelper, DCCustomValidators } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from 'app/services/electron/electron.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-routes-address-manage-export',
    templateUrl: './export.component.html'
})
export class AddressManageExportComponent implements OnInit {

    form: FormGroup;

    processing = false;

    constructor(
        private fb: FormBuilder,
        private modal: NzModalRef,
        private modalService: NzModalService,
        private msg: MessagePlusService,
        public http: _HttpClient,
        private translate: TranslateService,
        private electron: ElectronService
    ) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            ExportPath: [null, [Validators.required]],
            AddrExportType: [1, [Validators.required]],
            OprationBatchNo: [null],
            WalletId: [null],
            Category: [null],
            Type: [null]
        }, {
            validators: [DCCustomValidators.crossRequiredIf('OprationBatchNo', 'AddrExportType', (a, b) => b.value === 1) ]
        });
    }

    get exportWay() {
        return this.form.get('AddrExportType').value;
    }

    selectFolderPath() {
        const results = this.electron.remote.dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (results && results.length) {
            this.form.patchValue({
                ExportPath: results[0]
            });
        }
    }


    submit() {
        this.form.updateValueAndValidity();
        if (this.form.invalid) {
            FormHelper.validateWholeForm(this.form);
            return;
        }


        if (this.exportWay === 2) {
            if (FormHelper.isEmptyInputValue(this.form.get('WalletId').value) &&
                FormHelper.isEmptyInputValue(this.form.get('Category').value) &&
                FormHelper.isEmptyInputValue(this.form.get('Type').value)) {
                    this.msg.error('錢包、類別、類型至少選擇一個');
                    return;
                }
        }

        const postUrl = '/api/manager/address/list/export';
        const postData = {
            ...this.form.value
        };

        this.processing = true;
        this.http.post(postUrl, {
            data: postData
        })
        .pipe(finalize(() => this.processing = false))
        .subscribe(data => {
            this.msg.success('successToExport');
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
