import { SettingsService, _HttpClient } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent {
    form: FormGroup;
    type = 0;
    captchaInfo: any;
    startupLoding = false;
    constructor(
        fb: FormBuilder,
        modalSrv: NzModalService,
        private router: Router,
        @Optional()
        @Inject(ReuseTabService)
        private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
        private startupSrv: StartupService,
        public http: _HttpClient,
        public msg: NzMessageService,
    ) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(4)]],
            password: [null, Validators.required],
            remember: [true],
        });
        modalSrv.closeAll();
    }

    ngOnInit(): void {

    }

    get userName() {
        return this.form.controls.userName;
    }
    get password() {
        return this.form.controls.password;
    }

    submit() {
        this.userName.markAsDirty();
        this.userName.updateValueAndValidity();
        this.password.markAsDirty();
        this.password.updateValueAndValidity();

        if (this.form.invalid) return;

        // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
        // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
        this.http
            .post('/api/auth/login', {
                data: {
                    Username: this.userName.value,
                    Password: this.password.value
                }
            })
            .subscribe(
                (res: any) => {
                    if (!res.data) {
                        return;
                    }
                    // 清空路由复用信息
                    this.reuseTabService.clear();
                    // 设置用户Token信息
                    this.tokenService.set({ token: res.data.SessionKey });
                    // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
                    this.startupLoding = true;
                    this.startupSrv.load().then(() => {
                        this.startupLoding = false;
                        let url = this.tokenService.referrer.url || '/dashboard';
                        if (url.includes('/passport')) url = '/';
                        // if (url.startsWith('/api/')) url = '/dashboard';
                        this.router.navigateByUrl(url);
                    }, () => this.startupLoding = false);
                },
                err => {

                },
            );
    }
}
