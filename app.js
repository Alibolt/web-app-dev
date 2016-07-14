let win

const { BrowserWindow, app } = require('electron')
const create = () => {
    win = new BrowserWindow({width: 800, height: 600})
    win.loadURL(`file://${__dirname}/index.html`)
    win.webContents.openDevTools()
    win.on('closed', () => {
        win = null
    })
}

app.on('ready', create)
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
app.on('activate', () => win === null && create())