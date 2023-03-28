const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs');
let window;

class Windows {
    win = new BrowserWindow({
        width: 1490,
        height: 700,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true,
        }
    })

    addContact = new BrowserWindow({
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

    loadChat() {
        const data = require('./contacts.json');
        this.win.webContents.send('load-chats', data);

    }

    createWindow() {
        this.win.loadFile('index.html')
        this.addContact.loadFile("visuals/contact.html")

        this.win.once('ready-to-show', (event) => {
            this.loadChat();
        })

        this.win.once('close', (event) => {
            event.preventDefault();
            this.win.webContents.send('get-chats')
        })

        this.addContact.once('close', (event) => {
            event.preventDefault();
            this.addContact.hide();
        })

        ipcMain.on('chatData', (event, value) => {
            fs.writeFile('./contacts.json', JSON.stringify(value), 'utf-8', (error) => {
                if (error) {
                    console.log('[write auth]: ' + error);
                }
            })
            app.quit()
        })

        ipcMain.on('contact-show', () => {
            this.addContact.show()
        });

        ipcMain.on('submit:contactForm', (event, formData) => {
            this.win.webContents.send('new-chat', formData)
            this.addContact.hide();
        })


    }

}


app.whenReady().then(() => {
    window = new Windows()
    window.createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            window.createWindow()
            window.loadChat()
        }
    })
})



