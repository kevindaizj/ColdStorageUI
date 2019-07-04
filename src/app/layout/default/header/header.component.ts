import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { DCDialogService } from 'app/services/dialog/dialog.service';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  searchToggleStatus: boolean;

  constructor(public settings: SettingsService,
              private router: Router,
              @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
              private dialog: DCDialogService) { }

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }

  logout() {
    this.dialog.confirm('是否確定退出', () => {
      this.tokenService.clear();
      this.router.navigateByUrl(this.tokenService.login_url!);
    });
  }
}
