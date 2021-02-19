const { BrowserWindow } = require('electron')

class Window extends BrowserWindow {
  constructor(filePath, width, height) {
    super({
      width: width,
      height: height,
      resizable: false,
      backgroundColor: '#f1f5f8',
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        backgroundThrottling: false,
      },
    });

    this.loadFile(filePath)
  }
}

module.exports = Window
