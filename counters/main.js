/*jslint esversion: 6*/

const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;

function createWindow () {
  win = new BrowserWindow({width: 1160, height: 640});

  win.loadURL(url.format({
      pathname: path.join(__dirname, 'window.html'),
      protocol: 'file:',
      slashes: true
  }));

  win.webContents.openDevTools();

  win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null;
  });
}

ipcMain.on("save", (event, arg) => {
    let location = dialog.showSaveDialog(win,
        {

        }
    );
    if(location){
        fs.writeFile(location, arg, (err) => {
            if(err){
                dialog.showMessageBox(win,
                    {
                        type: "error",
                        message: "Couldn't save file",
                        detail: err.toString()
                    }
                );
            }
        });
    }
});

ipcMain.on("load", (event, arg) => {
    let location = dialog.showOpenDialog(win, {
        properties: ["openFile"]
    });
    if(location){
        //location is a one element array
        fs.readFile(location[0], "utf-8", (err, data) => {
            if(err){
                dialog.showMessageBox(win, {
                    type: "error",
                    message: "Couldn't open file",
                    detail: err.toString()
                });
            } else {
                event.sender.send("loaded", data);
            }
        });
    }
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
