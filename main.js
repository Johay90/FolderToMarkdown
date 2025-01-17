const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  globalShortcut.register('F12', () => {
    mainWindow.webContents.toggleDevTools();
  });

  Menu.setApplicationMenu(null);

  win.loadFile('build/index.html');

  win.maximize();
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
