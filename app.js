const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')

function createWindow() {


    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true,
        }
    })
    win.loadFile('index.html')


    let addContact = new BrowserWindow({
        width: 800,
        height: 500,
        title: 'Contact',
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true,
            devTools: true
        },
        show: false

    })
    addContact.loadFile("visuals/contact.html")

    addContact.once('close', (event) => {
        event.preventDefault();
        addContact.hide();
    })

    ipcMain.on('contact-show', () => {
        addContact.show()
    });

    ipcMain.on('submit:contactForm', (event, formData) => {
        win.webContents.send('new-chat', formData)
        addContact.close();
    })

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


