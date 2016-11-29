/**
 * Created by mfuesslin on 13.11.2016.
 */
var electron = require('electron');
const globalShortcut = electron.globalShortcut;
const BrowserWindow = require('electron').BrowserWindow;
const screen = require('electron').screen;
const clipboard = require('electron').clipboard;
const ipcMain = require('electron').ipcMain;
const clipboardWatcher = require('electron-clipboard-watcher');
const basel = require('basel-cli');
var fs = require("fs");

//var robot = require("robotjs");

//var app = remote.app;

function clipboardService() {

}

clipboardService.prototype.init = function () {
    clipboardWatcher({
       watchDelay: 1000,

        onImageChange: function(nativeImage) {
            var ts = new Date().getTime();
            var path = "images/clip-"+ts+".png";

            fs.writeFile(path, nativeImage.toPNG(), function(error) {
                if (error) {
                    console.error("write error:  " + error.message);
                } else {
                    basel.database.insert('clipboard', {image: path, datetime: new Date()})
                }
            });
        },


        onTextChange: function(text) {

            var clipboardContent = getClipboardTextContent();
            if (clipboardContent) {
                basel.database.insert('clipboard', {content: clipboardContent, plaintext: text, datetime: new Date()})
            }
        }
    });
    // Register a 'CommandOrControl+X' shortcut listener.
    const pasteKeyListener = globalShortcut.register('SHIFT+V', () => {
        var pasteContent = "";

    });

    if (!pasteKeyListener) {
        console.log("Could not register keyboard listener.");
    }
};

module.exports = new clipboardService();

function showClipboardWindow() {
    const {width, height} = screen.getPrimaryDisplay().workAreaSize;

    let top = new BrowserWindow({
        width: width,
        height: 200,
        frame: false
    });

    top.loadURL('file://' + __dirname + '/clipboard.html');

    top.show();
}


function getClipboardTextContent() {
    let contentType = clipboard.availableFormats();

    if (contentType.indexOf('text/html') !== -1) {
        return clipboard.readHtml();
    }
    if (contentType.indexOf("text/rtf") !== -1) {
        return clipboard.readRTF();
    }

    if (contentType.indexOf('text/plain') !== -1) {
        return clipboard.readText();
    }

    return null;
}