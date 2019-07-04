// 参考：https://ng-alain.com/docs/i18n
import { default as ngLang } from '@angular/common/locales/zh-Hant-HK';
import { NZ_I18N, zh_TW as zorroLang } from 'ng-zorro-antd';
import { DELON_LOCALE, zh_TW as delonLang } from '@delon/theme';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';

const LANG = {
  abbr: 'zh-Hant-HK',
  ng: ngLang,
  zorro: zorroLang,
  delon: delonLang,
};

export function registerLocale() {
    // register angular
    registerLocaleData(LANG.ng, LANG.abbr);
    // zh-tw在angular里找不到语言包，而ant-design的日期控件在繁体中文下用的都是zh-tw关键字，所以需要覆盖
    registerLocaleData(LANG.ng, 'zh-tw');
}


export const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: LANG.abbr },
  { provide: NZ_I18N, useValue: LANG.zorro },
  { provide: DELON_LOCALE, useValue: LANG.delon },
];
