const { app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')

function createWindow () {
    Menu.setApplicationMenu(null)

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true
        }
    })

    const addContact = new BrowserWindow({
        width: 800,
        height: 500,
        title: 'Contact',
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        show: false,
    })

    win.loadFile('index.html')
    addContact.loadFile("visuals/contact.html")

    ipcMain.handle('contact-show', () => {
        addContact.show()
    });

}


app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
