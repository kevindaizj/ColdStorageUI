import { StartupService } from '@core/startup/startup.service';
import { APP_INITIALIZER } from '@angular/core';

export function StartupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

export const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  }
];