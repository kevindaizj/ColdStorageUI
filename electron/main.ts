import { app, BrowserWindow, screen, session } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { AppMenuService } from './menus/app-menu.service';

let win: BrowserWindow;

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    center: true,
    width: size.width - 200,
    height: size.height - 60,
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
    minWidth: 1300,
    minHeight: 700
  });

  if (!serve)
    AppMenuService.construct();

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/../../node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {

    win.loadURL(url.format({
      pathname: path.join(__dirname, '..', 'CoinColdStorage-UI/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  win.on('ready-to-show', () => {
    win.show();
  });


  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    session.defaultSession.clearStorageData();
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

