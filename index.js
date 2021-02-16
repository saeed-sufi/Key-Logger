const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
fs = require("fs");
let mainWindow;

app.on("ready", createWindow);

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/src/index.html`);

  ipcMain.on("saveBtn:select", function (e, path, comments) {
    fs.writeFile(path, comments, function (err) {
      if (err) {
        return mainWindow.webContents.send("save:fail", err.toString());
      }
      mainWindow.webContents.send("save:success");
    });
  });

  const options = {
    type: "question",
    buttons: ["Yes", "No"],
    title: "Comments Not Saved",
    message: "Are you sure you want to quit?",
  };

  mainWindow.on("close", (e) => {
    e.preventDefault();

    mainWindow.webContents.send("app:close");
    ipcMain.on("comments:save", (e, isSaved) => {
      if (!isSaved) {
        dialog.showMessageBox(mainWindow, options).then((res) => {
          if (res.response == 0) {
            mainWindow.destroy();
          }
        });
      } else {
        mainWindow.destroy();
      }
    });
  });

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)

}

const menuTemplate = [
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
