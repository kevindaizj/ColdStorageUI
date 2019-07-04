import { Component, OnInit } from '@angular/core';
import { _HttpClient, SettingsService } from '@delon/theme';
import { STChange } from '@delon/abc';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { TableListService } from 'app/services/list/table-list.service';
import { TranslateService } from '@ngx-translate/core';
import { UserListColumns } from './list.column';
import { UserManageUserEditComponent } from './edit/edit.component';
import { MessagePlusService } from 'app/services/messages/message-plus.service';

@Component({
    selector: 'app-user-manage-user-list',
    templateUrl: './list.component.html',
    providers: [TableListService]
})
export class UserManageUserListComponent implements OnInit {

    columns = UserListColumns;
    currentUserId: string;
    currentUserRole: number;

    constructor(
        private http: _HttpClient,
        public msg: MessagePlusService,
        private modalService: NzModalService,
        private translate: TranslateService,
        private router: Router,
        public listService: TableListService,
        private settingServ: SettingsService
    ) {
        this.listService.listUrl = '/api/user/list';
        this.listService.conditionGenerator = (condition, pager, orders) => {
            return { ...condition, Index: pager.currentPage, PageSize: pager.itemsPerPage };
        };

        this.currentUserId = this.settingServ.user.UserId;
        this.currentUserRole = this.settingServ.user.RoleId;
    }

    ngOnInit() {
        this.search();
    }

    search() {
        this.listService.pager.currentPage = 1;
        this.listService.getList().subscribe();
    }

    stChange(e: STChange) {
        switch (e.type) {
            case 'pi':
                this.listService.pager.currentPage = e.pi;
                this.listService.getList().subscribe();
                break;
        }
    }

    manage(id?: string) {
        const modal = this.modalService.create({
            nzTitle: id ? this.translate.instant('edit') : this.translate.instant('add'),
            nzStyle: { top: '50px' },
            nzContent: UserManageUserEditComponent,
            nzComponentParams: {
                userId: id
            },
            nzMaskClosable: false,
            nzFooter: null,
            nzClosable: false
        });

        modal.afterClose.subscribe((refresh: boolean) => {
            if (refresh) {
                this.search();
            }
        });
    }

    activate(id: number) {
        this.http.get('/api/user/active', {
            userId: id
        }).subscribe(data => {
            this.msg.success('activateSuccess');
            this.search();
        })
    }

    deactivate(id: number) {
        this.modalService.confirm({
            nzTitle: this.translate.instant('sureToDeactivate'),
            nzOkType: 'danger',
            nzOnOk: () => {
                this.http.delete('/api/user/delete', {
                    userId: id
                }).subscribe(data => {
                    this.msg.success('deactivateSuccess');
                    this.search();
                })
            }
        });
    }

}
