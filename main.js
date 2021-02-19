const { app, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");
const Window = require("./app/Window");
const Menu = require("./app/Menu");
const SaveDialog = require("./app/SaveDialog");
fs = require("fs");
let mainWindow;

app.on("ready", () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 500,
    defaultHeight: 700,
  });

  mainWindow = new Window(
    `./src/index.html`,
    mainWindowState.width,
    mainWindowState.height
  );
  mainWindow.setPosition(900, 10)
  mainWindowState.manage(mainWindow);

  closingWindow(mainWindow);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

function closingWindow(mainWindow) {
  mainWindow.on("close", (e) => {
    e.preventDefault();

    mainWindow.webContents.send("app:close");
    ipcMain.on("comments:save", (e, isSaved) => {
      if (!isSaved) {
        const saveDialog = new SaveDialog(mainWindow);
      } else {
        mainWindow.destroy();
      }
    });
  });
}

ipcMain.on("saveBtn:select", function (e, path, comments) {
  fs.writeFile(path, comments, function (err) {
    if (err) {
      return mainWindow.webContents.send("save:fail", err.toString());
    }
    mainWindow.webContents.send("save:success");
  });
});

const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: "Ctrl + Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

if (process.env.NODE_ENV == "dev") {
  mainMenuTemplate.push({
    label: "View",
    submenu: [
      {
        role: "reload",
      },
      {
        label: "Toggle DevTools",
        accelerator: "Ctrl + Shift + I",
        click() {
          mainWindow.toggleDevTools();
        },
      },
    ],
  });
}
const mainMenu = new Menu(mainMenuTemplate);

