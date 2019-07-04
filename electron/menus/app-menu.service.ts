import { Menu, MenuItemConstructorOptions, app } from 'electron';

export class AppMenuService {

  private static getTemplate(): MenuItemConstructorOptions[] {
    const template: MenuItemConstructorOptions[] = [{
      label: '文件',
      submenu: [{
        label: '退出',
        accelerator: 'Ctrl+X',
        click: () => app.quit()
      }]
    }, {
      label: '視圖',
      submenu: [{
        label: '重载',
        accelerator: 'Ctrl+R',
        click: (item, win) => {
          if (win) {
            win.webContents.reload();
          }
        }
      }]
    }];

    return template;
  }

  public static construct() {
    const template = this.getTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }


}
