import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { I18NService } from '@core/i18n/i18n.service';
import { ENUSLang } from 'app/lang/en-US';
import { ZHCNLang } from 'app/lang/zh-CN';
import { ZHHKLang } from 'app/lang/zh-HK';
import { Observable, of } from 'rxjs';


// 加载i18n语言文件
export class LangLoader implements TranslateLoader {
    private langData: { [key: string]: any } = {
        'en-US': ENUSLang,
        'zh-CN': ZHCNLang,
        'zh-HK': ZHHKLang
    };
    getTranslation(lang: string): Observable<any> {
        return of(this.langData[lang]);
    }
}

export const I18NSERVICE_MODULES = [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: LangLoader
      }
    })
];

export const I18NSERVICE_PROVIDES = [
  { provide: ALAIN_I18N_TOKEN, useClass: I18NService, multi: false }
];