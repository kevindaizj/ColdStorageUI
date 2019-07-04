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
    selector: 'app-routes-tx-manage-import',
    templateUrl: './import.component.html'
})
export class TxManageImportComponent implements OnInit {

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
            PathFile: [null, [Validators.required]]
        });
    }

    selectFolderPath() {
        const results = this.electron.remote.dialog.showOpenDialog({ properties: ['openFile'] });
        if (results && results.length) {
            this.form.patchValue({
                PathFile: results[0]
            });
        }
    }


    submit() {
        this.form.updateValueAndValidity();
        if (this.form.invalid) {
            FormHelper.validateWholeForm(this.form);
            return;
        }

        const postUrl = '/api/manager/tx/list';
        const postData = {
            ...this.form.value
        };

        this.processing = true;
        this.http.post(postUrl, {
            data: postData
        })
        .pipe(finalize(() => this.processing = false))
        .subscribe(data => {
            data.data.importPath = this.form.get('PathFile').value;
            this.back(data.data);
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

    back(txInfo: any = null) {
        this.modal.destroy(txInfo);
    }

}
