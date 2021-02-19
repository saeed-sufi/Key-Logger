const { dialog } = require("electron");

class SaveDialog {
  constructor(window) {
    this.window = window;
    this.saveDialog();
  }

  saveDialog() {
    const options = {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Caution",
      message: "Comments not saved. Are you sure you want to quit?",
    };

    dialog.showMessageBox(this.window, options).then((res) => {
      if (res.response == 0) {
        this.window.destroy();
      } else {
        // console.log(res);
      }
    });
  }
}

module.exports = SaveDialog;
