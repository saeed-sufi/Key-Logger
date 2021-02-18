const { debug } = require("console");
const { app, ipcMain } = require("electron");
const Window = require("./app/Window");
const Menu = require("./app/Menu");
const SaveDialog = require("./app/SaveDialog");

fs = require("fs");
let mainWindow;

app.on("ready", () => {
  mainWindow = new Window(`file://${__dirname}/src/index.html`, 500, 700);
  closingWindow(mainWindow);
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

const mainMenu = new Menu(mainMenuTemplate);
