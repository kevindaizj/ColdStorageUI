import { MessagePlusService } from './../../services/messages/message-plus.service';
import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STChange } from '@delon/abc';
import { NzDrawerService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { TableListService } from 'app/services/list/table-list.service';
import { TranslateService } from '@ngx-translate/core';
import { TxListColumns } from './list.column';
import { DCMomentService } from 'app/services/moment/moment.service';
import { TxManageDetailComponent } from './detail/detail.component';

@Component({
    selector: 'app-tx-manage-tx-list',
    templateUrl: './list.component.html',
    providers: [TableListService]
})
export class TxManageListComponent implements OnInit {

    columns = TxListColumns;

    constructor(
        private http: _HttpClient,
        public msg: MessagePlusService,
        private drawerService: NzDrawerService,
        private translate: TranslateService,
        private router: Router,
        public listService: TableListService,
        private momentServ: DCMomentService
    ) {
        this.listService.listUrl = '/api/manager/trans/list';
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

    detail(tx: any) {
        this.drawerService.create<TxManageDetailComponent, {
            txInfo: any
        }>({
            nzTitle: this.translate.instant('detail'),
            nzContent: TxManageDetailComponent,
            nzContentParams: {
                txInfo: tx
            },
            nzMaskClosable: true,
            nzWidth: 650,
            nzClosable: false
        });
    }

    goToSign() {
        this.router.navigate([`/transaction-manage/sign`]);
    }

}
