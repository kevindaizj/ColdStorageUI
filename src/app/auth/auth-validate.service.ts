import { Injectable } from '@angular/core';
import { DCMenuService } from 'app/services/menu/menu.service';
import { NotificationService } from 'app/services/notification/notification.service';
import { DEFAULT_MENU_ACTION, ALL_RIGHTS_MENU_ACTION } from 'app/models/DCMenu';
import { Route } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class AuthValidateService {

    constructor(private menuServ: DCMenuService,
        private notification: NotificationService) {

    }

    checkPermit(route: Route, url: string, permit: string): boolean {
        let group = null;
        if (route.data) {
            group = route.data.authGroup;
        }
        return this.check(group, url, permit);
    }

    checkRoute(route: Route, url: string): boolean {
        let group = null;
        let permit = null;
        if (route.data) {
            group = route.data.authGroup;
            permit = route.data.authPermit;
        }

        const result = this.check(group, url, permit);
        if (!result)
            this.notification.error('UnauthenticationToService');
        return result;
    }


    private check(code: string, url: string, permit: string = null): boolean {
        permit = permit || ALL_RIGHTS_MENU_ACTION;
        let authMenu = this.menuServ.getAuthMenuByCode(code);
        if (!authMenu)
            authMenu = this.menuServ.getAuthMenuByPath(code);
        if (!authMenu)
            authMenu = this.menuServ.getAuthMenuByPath(url);

        let result = false;
        if (!authMenu)
            result = false;
        else {
            result = authMenu.Checked;
            if (result && permit) {
                result = authMenu.MenuActionList.some(o => o === permit);
            }
        }

        return result;
    }



}
