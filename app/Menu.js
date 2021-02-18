const { Menu } = require("electron");

class MenuCreator {
  constructor(template) {
    this.template = template;
    this.createMenu();
  }

  createMenu() {
    const menu = Menu.buildFromTemplate(this.template);
    Menu.setApplicationMenu(menu);
  }
}

module.exports = MenuCreator;
