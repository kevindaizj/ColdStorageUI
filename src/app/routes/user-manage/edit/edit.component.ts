import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, SettingsService } from '@delon/theme';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DCCustomValidators } from '@shared';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-manage-user-edit',
  templateUrl: './edit.component.html',
})
export class UserManageUserEditComponent implements OnInit, OnDestroy {
    @Input() userId: string;
    isAdd = false;
    user: any;
    currentUserRole: number;

    passwordVisible: false;
    confirmPasswordVisible: false;

    form: FormGroup;

    private destroySignal = new Subject<boolean>();

    constructor(
        private fb: FormBuilder,
        private modal: NzModalRef,
        private modalService: NzModalService,
        private msg: NzMessageService,
        public http: _HttpClient,
        private translate: TranslateService,
        private settingServ: SettingsService
    ) {
        this.currentUserRole = this.settingServ.user.RoleId;
    }

    ngOnInit(): void {
        if (!this.userId)
            this.isAdd = true;
        if (this.userId)
            this.getUser();

        this.form = this.fb.group({
            UserName: [null, [Validators.required]],
            RoleId: [{value: this.currentUserRole === 2 ? 2 : null, disabled: this.currentUserRole === 2 }, [Validators.required]],
            OriginalPwd: [null],
            ConfirmPwd: [null]
        });

        if (this.isAdd) {
            if (this.currentUserRole === 2) {
                this.form.get('RoleId').clearValidators();
            }
            this.form.get('OriginalPwd').setValidators([Validators.required]);
            this.form.get('ConfirmPwd')
            .setValidators([Validators.required, DCCustomValidators.compareWith('OriginalPwd', this.destroySignal.asObservable())]);
        } else {
            this.form.get('ConfirmPwd')
            .setValidators([DCCustomValidators.compareWith('OriginalPwd', this.destroySignal.asObservable())]);
        }
    }

    private getUser() {
        this.http.get(`/api/user/detail/${this.userId}`, {
                userId: this.userId
            })
            .subscribe((data: any) => {
                this.user = data.data;
                this.setFormGroup(this.user);
            });
    }

    setFormGroup(user) {
        this.form.patchValue({ ...user });
        this.form.markAsPristine();
    }

    submit() {
        const postUrl = this.userId ? '/api/user/update' : '/api/user/add';
        const postData = {
            ...this.form.value,
            UserId: this.isAdd ? null : this.user.UserId
        };

        if (this.currentUserRole === 2) {
            postData.RoleId = 2;
        }

        this.http.post(postUrl, {
            data: postData
        }).subscribe(data => {
            this.msg.success(this.translate.instant('saveSuccess') );
            this.back(true);
        });
    }

    close() {
        if (!this.form.pristine) {
            this.modalService.confirm({
                nzTitle: this.translate.instant('exitWithoutSaving') ,
                nzOnOk: () => this.back()
            });
        } else {
            this.back();
        }
    }

    back(refresh: boolean = false) {
        this.modal.destroy(refresh);
    }

    ngOnDestroy(): void {
        this.destroySignal.next(true);
        this.destroySignal.unsubscribe();
    }
}
