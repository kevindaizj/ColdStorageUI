import { WalletManageComponent } from './wallet-manage/wallet-manage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { WalletManageCreateWalletComponent } from './wallet-manage/create-wallet/create-wallet.component';
import { ALL_RIGHTS_MENU_ACTION } from 'app/models/DCMenu';
import { RouteGuard } from 'app/auth/route-guard';
import { UserManageUserListComponent } from './user-manage/list.component';
import { AddressManageListComponent } from './address-manage/list.component';
import { TxManageListComponent } from './tx-manage/list.component';
import { TxManageSignManageComponent } from './tx-manage/sign/sign.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    canActivateChild: [RouteGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, data: { title: '仪表盘' } },
      { path: 'exception', loadChildren: './exception/exception.module#ExceptionModule' },
      { path: 'wallet-manage', component: WalletManageComponent },
      { path: 'wallet-manage/add', component: WalletManageCreateWalletComponent,
        data: { authGroup: '/wallet-manage', authPermit: ALL_RIGHTS_MENU_ACTION } },
      { path: 'user-manage', component: UserManageUserListComponent },
      { path: 'address-manage', component: AddressManageListComponent },
      { path: 'transaction-manage', component: TxManageListComponent },
      { path: 'transaction-manage/sign', component: TxManageSignManageComponent,
        data: { authGroup: '/transaction-manage', authPermit: ALL_RIGHTS_MENU_ACTION } },
    ]
  },
  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      { path: 'login', component: UserLoginComponent, data: { title: '登录' } },
      { path: 'register', component: UserRegisterComponent, data: { title: '注册' } },
      { path: 'register-result', component: UserRegisterResultComponent, data: { title: '注册结果' } },
      { path: 'lock', component: UserLockComponent, data: { title: '锁屏' } },
    ]
  },
  // 单页不包裹Layout
  { path: 'callback/:type', component: CallbackComponent },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes, {
        useHash: environment.useHash,
        // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
        // Pls refer to https://ng-alain.com/components/reuse-tab
        scrollPositionRestoration: 'top',
      }
    )],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
