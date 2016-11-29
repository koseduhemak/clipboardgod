var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

// referência global para manter a instância da janela até que sejam fechadas pelo usuário então ele irá ser fechado quando o JavaScript fizer Garbage collection
var mainWindow = null;

// Sair da aplicação quando todas as janelas forem fechadas
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  var clipboard = require('./services/clipboard/clipboard');

    const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize

  // Cria a janela do browser.
  mainWindow = new BrowserWindow({width: width, height: 200, frame: false, transparent: true});

  // Carrega o arquivo html principal.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  clipboard.init();

  // aber o DevTools. (console, inspecionar elemento, etc)
  // mainWindow.webContents.openDevTools(); 

  // Evento emitido quando a janela é fechada, usado para destruir instancia.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});