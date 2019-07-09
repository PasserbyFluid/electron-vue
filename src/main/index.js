import { app, BrowserWindow } from 'electron'
const { globalShortcut } = require('electron')
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  mainWindow = new BrowserWindow({
    useContentSize: true,
    minWidth:1440,
		width:1300,
		height:700,
    minHeight:700,
    title: '用户管理系统',
    webPreferences: {webSecurity: false}
  })
  mainWindow.loadURL(winURL)
  mainWindow.on('close', () => {
    mainWindow.webContents.send('close-win', 'nihao');
    mainWindow = null
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  globalShortcut.register('CommandOrControl+f12', (event, arg) => {
    mainWindow.openDevTools();  
})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
