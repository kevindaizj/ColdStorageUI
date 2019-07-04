import { MessagePlusService } from './../../services/messages/message-plus.service';
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STChange } from '@delon/abc';
import { NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { TableListService } from 'app/services/list/table-list.service';
import { TranslateService } from '@ngx-translate/core';
import { UserListColumns } from './list.column';
import { DCMomentService } from 'app/services/moment/moment.service';
import { AddressManageCreateComponent } from './create/create.component';
import { AddressManageExportComponent } from './export/export.componet';

@Component({
    selector: 'app-address-manage-address-list',
    templateUrl: './list.component.html',
    providers: [TableListService]
})
export class AddressManageListComponent implements OnInit {

    columns = UserListColumns;

    constructor(
        private http: _HttpClient,
        public msg: MessagePlusService,
        private modalService: NzModalService,
        private translate: TranslateService,
        private router: Router,
        public listService: TableListService,
        private momentServ: DCMomentService
    ) {
        this.listService.listUrl = '/api/manager/address/list';
        this.listService.conditionGenerator = (condition, pager, orders) => {
            return {
                ...condition,
                Index: pager.currentPage,
                PageSize: pager.itemsPerPage,
                DateFrom: momentServ.startOf(condition.DateFrom, 'minutes'),
                DateTo: momentServ.endOf(condition.DateTo, 'minutes'),
            };
        };
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

    create() {
        const modal = this.modalService.create({
            nzTitle: this.translate.instant('createAndExportAddress'),
            nzStyle: { top: '50px' },
            nzContent: AddressManageCreateComponent,
            nzComponentParams: {},
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

    export() {
        this.modalService.create({
            nzTitle: this.translate.instant('exportAddress'),
            nzStyle: { top: '20px' },
            nzContent: AddressManageExportComponent,
            nzComponentParams: {},
            nzMaskClosable: false,
            nzFooter: null,
            nzClosable: false
        });
    }

}
