import { MenuService, Menu } from '@delon/theme';
import { Injectable } from '@angular/core';
import { DCMenu, AuthMenu, DEFAULT_MENU_ACTION, ALL_RIGHTS_MENU_ACTION } from 'app/models/DCMenu';


@Injectable({
    providedIn: 'root'
})
export class DCMenuService {

    private datas: DCMenu[];
    get menus() {
        return this.datas;
    }

    private codeMap: { [key: string]: AuthMenu } = {};
    private pathMap: { [key: string]: AuthMenu } = {};

    constructor(private menuService: MenuService) {

    }

    getAuthMenuByCode(code: string) {
        if (!code)
            return null;
        return this.codeMap[code];
    }
    getAuthMenuByPath(path: string) {
        if (!path)
            return null;
        return this.pathMap[path];
    }

    add(originalMenus: DCMenu[]) {
        this.datas = originalMenus;
        const newMenus = this.convert(originalMenus);
        this.menuService.add(newMenus);
        this.buildAuthMenuMaps(originalMenus);
    }

    private convert(originalMenus: DCMenu[]): Menu[] {
        const menus = this.build(originalMenus);
        const result: Menu[] = [{
            text: '主导航',
            i18n: 'Menu_Main',
            group: true,
            hideInBreadcrumb: true,
            children: menus
        }];

        return result;
    }

    /**
     * 创建显示菜单
     */
    private build(originalMenus: DCMenu[]): Menu[] {
        const menus: Menu[] = [];

        for (const item of originalMenus) {
            if (!item.Checked)
                continue;

            const menu: Menu = {
                text: item.Name,
                i18n: 'Menu_' + item.Code,
                link: item.Path,
                icon: item.Icon
            }

            if (item.Children && item.Children.length) {
                menu.children = this.build(item.Children);
            }

            menus.push(menu);
        }

        return menus;
    }


    /**
     * 创建权限菜单Map
     * Checked(是否显示) = 父菜单Checked && 当前菜单Checked
     * MenuActionList(操作项权限)：不受父菜单影响
     */
    private buildAuthMenuMaps(originalMenus: DCMenu[], parent: DCMenu = null) {
        for (const menu of originalMenus) {
            const authMenu: AuthMenu = {
                Checked: menu.Checked,
                Name: menu.Name,
                Code: menu.Code,
                Path: menu.Path,
                MenuActionList: []
            };

            if (parent) {
                authMenu.Checked = parent.Checked && authMenu.Checked;
            }

            if (authMenu.Checked) {
                authMenu.MenuActionList.push(DEFAULT_MENU_ACTION);
                authMenu.MenuActionList.push(ALL_RIGHTS_MENU_ACTION);
            }

            this.codeMap[authMenu.Code] = authMenu;
            if (authMenu.Path)
                this.pathMap[authMenu.Path] = authMenu;

            if (menu.Children && menu.Children.length)
                this.buildAuthMenuMaps(menu.Children, menu);
        }
    }


}
