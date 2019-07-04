import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzDrawerService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessagePlusService } from 'app/services/messages/message-plus.service';
import { TableFrontListService } from 'app/services/list/table-front-list.service';
import { containsStr } from '@shared';
import { ConditionPredicateMapper } from 'app/models/list/table-list';
import { DCDialogService } from 'app/services/dialog/dialog.service';
import { TxManageImportComponent } from '../import/import.component';
import { TxManageUnsignedDetailComponent } from '../unsigned-detail/detail.component';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-tx-manage-tx-sign-manage',
    templateUrl: './sign.component.html',
    providers: [TableFrontListService]
})
export class TxManageSignManageComponent implements OnInit {

    title = 'signature';
    histories: any;

    isImport = false;
    importPath: string;
    txList: any[];
    hasError = false;
    processing = false;

    constructor(
        private http: _HttpClient,
        public msg: MessagePlusService,
        private modalService: NzModalService,
        private drawerService: NzDrawerService,
        private translate: TranslateService,
        private router: Router,
        private dialog: DCDialogService,
        public listService: TableFrontListService,
    ) {
        this.listService.initialize(
            () => this.txList,
            (item: any) => this.filterList(item),
            null,
            (item: any) => this.filterList(item) && item.CheckMessage
        );
    }

    ngOnInit() {
        this.histories = [{
            link: '/transaction-manage',
            i18nTitle: 'Menu_TransactionManagement',
            hitMenu: true
        }, {
            i18nTitle: this.title,
        }];
    }

    import() {
        const modal = this.modalService.create({
            nzTitle: this.translate.instant('import'),
            nzStyle: { top: '50px' },
            nzContent: TxManageImportComponent,
            nzComponentParams: {},
            nzMaskClosable: false,
            nzFooter: null,
            nzClosable: false
        });

        modal.afterClose.subscribe((txInfo: any) => {
            if (txInfo) {
                this.isImport = true;
                this.importPath = txInfo.importPath;
                this.hasError = txInfo.Status === 2;
                this.txList = txInfo.TxList || [];
                this.listService.search();
            }
        });
    }

    private filterList(item: any): boolean {
        const mapper: ConditionPredicateMapper = {
            OperationId: (p, cp) => containsStr(p, cp),
            FromAddress: (p, cp) => containsStr(p, cp),
            ToAddress: (p, cp) => containsStr(p, cp),
            FeeAddress: (p, cp) => containsStr(p, cp),
            ChangeAddress: (p, cp) => containsStr(p, cp),
        };

        const matched = this.listService.conditionFilter(item, this.listService.condition, mapper);
        return matched;
    }

    detail(tx: any) {
        this.drawerService.create<TxManageUnsignedDetailComponent, {
            txInfo: any
        }>({
            nzTitle: this.translate.instant('detail'),
            nzContent: TxManageUnsignedDetailComponent,
            nzContentParams: {
                txInfo: tx
            },
            nzMaskClosable: true,
            nzWidth: 650,
            nzClosable: false
        });
    }

    sign() {
        if (!this.importPath) {
            return;
        }

        const postUrl = '/api/manager/tx/list/sign';
        const postData = {
            PathFile: this.importPath,
        };
        this.processing = true;
        this.http.post(postUrl, {
            data: postData
        })
        .pipe(finalize(() => this.processing = false))
        .subscribe(data => {
            this.msg.success('signSuccess');
            this.back();
        });
    }

    exit() {
        if (this.txList) {
            this.dialog.confirm('exitWithoutSaving', () => this.back());
        } else {
            this.back();
        }
    }

    private back() {
        this.router.navigate(['/transaction-manage']);
    }


}
