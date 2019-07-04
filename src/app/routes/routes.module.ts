import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { WalletManageComponent } from './wallet-manage/wallet-manage.component';
import { WalletCardComponent } from './wallet-manage/wallet-card/wallet-card.component';
import { WalletManageCreateWalletComponent } from './wallet-manage/create-wallet/create-wallet.component';
import { WalletManageWalletDetailComponent } from './wallet-manage/detail/detail.component';
import { WalletManageWalletUnlockComponent } from './wallet-manage/unlock/unlock.component';
import { WalletManageWalletRecoverComponent } from './wallet-manage/recover/recover.component';
import { UserManageUserListComponent } from './user-manage/list.component';
import { UserManageUserEditComponent } from './user-manage/edit/edit.component';
import { WalletManageWalletEditComponent } from './wallet-manage/edit/edit.component';
import { AddressManageListComponent } from './address-manage/list.component';
import { AddressManageCreateComponent } from './address-manage/create/create.component';
import { AddressManageExportComponent } from './address-manage/export/export.componet';
import { TxManageListComponent } from './tx-manage/list.component';
import { TxManageDetailComponent } from './tx-manage/detail/detail.component';
import { TxManageSignManageComponent } from './tx-manage/sign/sign.component';
import { TxManageImportComponent } from './tx-manage/import/import.component';
import { TxManageUnsignedDetailComponent } from './tx-manage/unsigned-detail/detail.component';

const COMPONENTS = [
  DashboardComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
  // business pages
  WalletManageComponent,
  WalletCardComponent,
  WalletManageCreateWalletComponent,
  UserManageUserListComponent,
  AddressManageListComponent,
  TxManageListComponent,
  TxManageSignManageComponent
];
const COMPONENTS_NOROUNT = [
  WalletManageWalletDetailComponent,
  WalletManageWalletEditComponent,
  WalletManageWalletUnlockComponent,
  WalletManageWalletRecoverComponent,
  UserManageUserEditComponent,
  AddressManageCreateComponent,
  AddressManageExportComponent,
  TxManageDetailComponent,
  TxManageUnsignedDetailComponent,
  TxManageImportComponent
];

@NgModule({
  imports: [ SharedModule, RouteRoutingModule ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class RoutesModule {}
