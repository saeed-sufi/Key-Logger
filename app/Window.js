const { BrowserWindow } = require('electron')

class Window extends BrowserWindow {
  constructor(filePath, width, height) {
    super({
      width: width,
      height: height,
      resizable: false,
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        backgroundThrottling: false,
      },
    });

    this.loadURL(filePath)
  }
}

module.exports = Window
