import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';

// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
import { DictSelectionComponent } from './components/selection/dict-select.component';
import { DictMultipleSelectionComponent } from './components/selection/dict-multiple-select.component';
import { DCBreadcrumbComponent } from './components/breadcrumb/breadcrumb.compont';
import { DCImageUploaderComponent } from './components/upload/image-uploader.component';
import { AuthValidateDirective } from './directives/auth-validate.directive';
import { DictPipe } from './pipes/dict.pipe';
import { NullToDefaultPipe } from './pipes/nullToDefault.pipe';
import { CompareWithValidator } from './validators/directives/compareWith.validator';
import { DCRibbonComponent } from './components/ribbon/ribbon.component';
import { WalletSelectComponent } from './components/selection/wallet-select.component';
import { LoadedWalletSelectComponent } from './components/selection/loaded-wallet-select.component';

const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule
];
// #endregion

// #region your componets & directives
const COMPONENTS = [
  DictSelectionComponent,
  DictMultipleSelectionComponent,
  DCBreadcrumbComponent,
  DCImageUploaderComponent,
  DCRibbonComponent,
  WalletSelectComponent,
  LoadedWalletSelectComponent
];
const WIDGETS = [

];
const DIRECTIVES = [
  AuthValidateDirective
];
// #endregion

// #region Pipes
const PIPES = [
  DictPipe,
  NullToDefaultPipe
];
// #endregion

//#region Validators
const VALIDATORS = [
  CompareWithValidator
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...WIDGETS,
    ...DIRECTIVES,
    ...PIPES,
    ...VALIDATORS
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...WIDGETS,
    ...DIRECTIVES,
    ...PIPES,
    ...VALIDATORS
  ]
})
export class SharedModule { }
