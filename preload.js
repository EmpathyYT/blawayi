const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    contactShow: () => ipcRenderer.invoke('contact-show'),
})