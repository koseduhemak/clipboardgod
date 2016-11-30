/**
 * Created by mfuesslin on 13.11.2016.
 */
var electron = require('electron');
const globalShortcut = electron.globalShortcut;
const BrowserWindow = require('electron').BrowserWindow;
const screen = require('electron').screen;
const clipboard = require('electron').clipboard;
const nativeImage = electron.nativeImage;
const clipboardWatcher = require('electron-clipboard-watcher');
const basel = require('basel-cli');
const fs = require("fs");
const md5 = require("md5");

//var robot = require("robotjs");

//var app = remote.app;

function clipboardService() {

}

clipboardService.prototype.init = function () {
    clipboardWatcher({
       watchDelay: 1000,

        onImageChange: function(nativeImage) {
            let ts = new Date().getTime();
            let path = "images/clip-"+ts+".png";
            let pngImage = nativeImage.toPNG();
            let imageMD5 = md5(pngImage);

            let rows = basel.database.run("SELECT * FROM clipboard WHERE imageMD5 = ?", [imageMD5]);

            // check if a row containing the same image already exists
            if (rows.length == 0) {

                fs.writeFile(path, pngImage, function (error) {
                    if (error) {
                        console.error("write error:  " + error.message);
                    } else {
                        basel.database.insert('clipboard', {image: path, datetime: new Date(), imageMD5: imageMD5})
                    }
                });
            } else {
                basel.database.update('clipboard', {datetime: new Date()}, {id: rows[0].id});
            }
        },


        onTextChange: function(text) {

            let clipboardContent = getClipboardTextContent();
            if (clipboardContent) {
                let rows = basel.database.run("SELECT * FROM clipboard WHERE plaintext = ?", [text]);

                if (rows.length == 0) {
                    basel.database.insert('clipboard', {
                        content: clipboardContent,
                        plaintext: text,
                        datetime: new Date()
                    })
                } else {
                    basel.database.update('clipboard', {datetime: new Date()}, {id: rows[0].id});
                }
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

clipboardService.prototype.writeToClipboard = function(contentElement) {
    console.log(contentElement);
    let imgSrc = contentElement.children("img").attr("src");
    if (imgSrc != undefined) {
        fs.access(imgSrc, fs.constants.R_OK, (err) => {
            console.log(err);
        });
        clipboard.writeImage(nativeImage.createFromPath(imgSrc));
    } else {
        clipboard.writeText(contentElement.text());
    }
    //clipboard.writeText(content);
}

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